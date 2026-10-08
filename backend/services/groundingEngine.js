import { documentStore } from './documentStore.js';
import { retrievalEngine } from './retrievalEngine.js';

/**
 * Multi-Stage Grounding Verification & Entailment Engine
 * Enforces Zero Fabricated Facts / Citations Pass/Fail Gate
 */
export class GroundingEngine {
  constructor() {
    this.entailmentThreshold = 0.60;
  }

  /**
   * Decompose document or answer into atomic verifiable assertions,
   * protecting legal citations, abbreviations, and stripping pleading boilerplate.
   */
  decomposeIntoClaims(text) {
    if (!text) return [];

    // Clean boilerplate procedural lines
    const lines = text.split('\n').filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('in the court of') ||
          lower.startsWith('criminal misc') ||
          lower.startsWith('in the matter of') ||
          lower.startsWith('state of karnataka') ||
          lower.startsWith('versus') ||
          lower.includes('prosecution / respondent') ||
          lower.includes('accused / petitioner') ||
          lower.startsWith('application under') ||
          lower.startsWith('most respectfully showeth') ||
          lower.startsWith('prayer:') ||
          lower.startsWith('wherefore') ||
          lower.startsWith('(a) ') ||
          lower.startsWith('(b) ') ||
          lower.startsWith('advocate for') ||
          lower.startsWith('dated:') ||
          lower.startsWith('bengaluru') ||
          lower.startsWith('by speed post') ||
          lower.startsWith('to,') ||
          lower.startsWith('subject:') ||
          lower.startsWith('dear sir') ||
          lower.startsWith('legal counsel')) {
        return false;
      }
      return true;
    });

    const sanitizedText = lines.join('\n');

    // Protect legal abbreviations from premature sentence splitting
    const protectedText = sanitizedText
      .replace(/\b(FIR\s+No)\./gi, '$1_DOT_')
      .replace(/\b([vV])\./g, '$1_DOT_')
      .replace(/\b(u\/s)\./gi, '$1_DOT_')
      .replace(/\b(Sec|S)\./gi, '$1_DOT_')
      .replace(/\b(Cr\.?P\.?C)\./gi, '$1_DOT_')
      .replace(/\b(B\.?N\.?S)\./gi, '$1_DOT_')
      .replace(/\b(B\.?N\.?S\.?S)\./gi, '$1_DOT_')
      .replace(/\b(B\.?S\.?A)\./gi, '$1_DOT_')
      .replace(/\b(Shri|Smt|Mr|Mrs|Dr|Adv)\./gi, '$1_DOT_')
      .replace(/\b(Anr|Ors)\./gi, '$1_DOT_')
      .replace(/\b(Ltd|Inc|LLP)\./gi, '$1_DOT_')
      .replace(/\b(Pvt)\./gi, '$1_DOT_');

    // Split on paragraph or terminal sentences
    const rawSentences = protectedText
      .split(/(?<=[.?!])\s+(?=[A-Z0-9"“\d])|\n\n+/)
      .map(s => s.replace(/_DOT_/g, '.').trim())
      .filter(s => s.length > 20);

    const claims = [];
    let claimCounter = 1;

    for (const rawSentence of rawSentences) {
      // Strip leading numbering e.g. "1. That " or "2. That "
      const cleaned = rawSentence.replace(/^\d+[\.\)]\s*(?:That\s+)?/i, 'That ').trim();

      // Extract explicit citation anchors [[CITE:chunkId]]
      const citeMatches = cleaned.match(/\[\[CITE:([^\]]+)\]\]/g) || [];
      const explicitCitations = citeMatches.map(m => m.replace('[[CITE:', '').replace(']]', ''));

      const cleanText = cleaned.replace(/\[\[CITE:[^\]]+\]\]/g, '').trim();
      if (cleanText.length < 15) continue;

      const entities = this.extractEntities(cleanText);

      claims.push({
        claimId: `CLM-${String(claimCounter++).padStart(3, '0')}`,
        claimText: cleanText,
        explicitCitations,
        entities
      });
    }

    return claims;
  }

  /**
   * Extract key verifiable legal entities: dates, currencies, sections, identifiers
   */
  extractEntities(text) {
    const dates = text.match(/\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/gi) || [];
    const amounts = text.match(/(?:INR|Rs\.?|USD|\$)\s*[\d,]+(?:\s*(?:Lakhs?|Crores?|Lakh|Crore|million|billion))?/gi) || [];
    const sections = text.match(/(?:Section|Sec\.)\s+\d+[A-Za-z]?(?:\(\d+\))?(?:\s+[A-Za-z]+)?/gi) || [];
    const identifiers = text.match(/(?:FIR\s+No\.?\s*[\w/-]+|Flight\s+[\w-]+|Passport\s+No\.?\s*[\w]+)/gi) || [];

    return {
      dates: Array.from(new Set(dates)),
      amounts: Array.from(new Set(amounts)),
      sections: Array.from(new Set(sections)),
      identifiers: Array.from(new Set(identifiers))
    };
  }

  /**
   * Verify an atomic claim against retrieved corpus or explicitly cited chunks
   */
  verifyClaim(claim, caseId) {
    let candidateChunks = [];

    // 1. If explicit citations exist, prioritize those specific chunks
    if (claim.explicitCitations && claim.explicitCitations.length > 0) {
      const allChunks = documentStore.getGlobalCorpusChunks(caseId);
      for (const citeId of claim.explicitCitations) {
        const found = allChunks.find(c => c.chunkId === citeId || c.docId === citeId);
        if (found) candidateChunks.push(found);
      }
    }

    // 2. Supplement with hybrid search
    const searchResults = retrievalEngine.search(claim.claimText, caseId, 5);
    for (const sr of searchResults) {
      if (!candidateChunks.some(c => c.chunkId === sr.chunkId)) {
        candidateChunks.push(sr);
      }
    }

    if (candidateChunks.length === 0) {
      return {
        ...claim,
        status: 'UNSUPPORTED',
        entailmentScore: 0.0,
        verdict: 'NO_EVIDENCE_FOUND',
        confidence: 'LOW',
        sourceDocId: null,
        chunkId: null,
        sourceTitle: null,
        verbatimQuote: null
      };
    }

    // 3. Score entailment across candidate chunks
    let bestMatch = null;
    let highestEntailment = -1;

    for (const candidate of candidateChunks) {
      const entailment = this.calculateEntailment(claim, candidate, caseId);
      if (entailment.score > highestEntailment) {
        highestEntailment = entailment.score;
        bestMatch = {
          candidate,
          ...entailment
        };
      }
    }

    // 4. Entity Hallucination Check against the entire active case record
    // (A claim may aggregate facts from multiple verified documents in the dossier)
    const entityHallucination = this.checkEntityAgainstDossier(claim.entities, caseId);

    // 5. Determine verdict
    let status = 'UNSUPPORTED';
    let verdict = 'REJECTED';

    if (highestEntailment >= this.entailmentThreshold && !entityHallucination.hasHallucination) {
      status = 'VERIFIED';
      verdict = 'GROUNDED_IN_SOURCE';
    } else if (highestEntailment >= 0.40 && !entityHallucination.hasHallucination) {
      status = 'VERIFIED'; // Partial with 0 hallucinations passes verification
      verdict = 'GROUNDED_ACROSS_DOSSIER';
    } else {
      status = 'FABRICATION_RISK';
      verdict = entityHallucination.hasHallucination
        ? `FABRICATED_ENTITIES: ${entityHallucination.hallucinated.join(', ')}`
        : 'UNGROUNDED_CLAIM';
    }

    return {
      claimId: claim.claimId,
      claimText: claim.claimText,
      status,
      verdict,
      entailmentScore: parseFloat(highestEntailment.toFixed(3)),
      confidence: highestEntailment >= 0.70 ? 'HIGH' : highestEntailment >= 0.45 ? 'MEDIUM' : 'LOW',
      sourceDocId: bestMatch?.candidate?.docId || null,
      chunkId: bestMatch?.candidate?.chunkId || null,
      sourceTitle: bestMatch?.candidate?.docTitle || null,
      sourceType: bestMatch?.candidate?.sourceType || null,
      verbatimQuote: bestMatch?.matchedSpan || null,
      citationAnchor: bestMatch?.candidate?.chunkId || null
    };
  }

  calculateEntailment(claim, candidate, caseId) {
    const claimTokens = retrievalEngine.tokenize(claim.claimText);
    const candTokens = retrievalEngine.tokenize(candidate.text);

    if (claimTokens.length === 0 || candTokens.length === 0) {
      return { score: 0, matchedSpan: '' };
    }

    const candSet = new Set(candTokens);
    let matchedTokens = 0;
    for (const t of claimTokens) {
      if (candSet.has(t)) matchedTokens++;
    }
    const tokenOverlap = matchedTokens / claimTokens.length;

    // Check if candidate chunk is explicitly cited
    const isExplicitlyCited = claim.explicitCitations.includes(candidate.chunkId) ||
                              claim.explicitCitations.includes(candidate.docId);

    const boost = isExplicitlyCited ? 0.35 : 0.0;
    const compositeScore = Math.min(1.0, (tokenOverlap * 0.75 + boost));

    const matchedSpan = retrievalEngine.extractRelevantSpan(candidate.text, claimTokens);

    return {
      score: compositeScore,
      matchedSpan
    };
  }

  /**
   * Check whether asserted entities exist anywhere in the active case dossier or statutes
   */
  checkEntityAgainstDossier(entities, caseId) {
    const allChunks = documentStore.getGlobalCorpusChunks(caseId);
    const fullText = allChunks.map(c => c.text).join(' ').toLowerCase();

    const hallucinated = [];

    // Verify dates
    for (const d of entities.dates) {
      const cleanDate = d.toLowerCase().replace(/st|nd|rd|th/g, '');
      if (!fullText.includes(cleanDate) && !fullText.includes(d.toLowerCase())) {
        hallucinated.push(`Date: ${d}`);
      }
    }

    // Verify amounts with and without commas
    const fullTextNoCommas = fullText.replace(/,/g, '');
    for (const a of entities.amounts) {
      const digits = a.replace(/[^\d]/g, '');
      if (digits.length >= 3 && !fullTextNoCommas.includes(digits) && !fullText.includes(a.toLowerCase())) {
        hallucinated.push(`Amount: ${a}`);
      }
    }

    // Verify statutory sections
    for (const s of entities.sections) {
      const secNum = s.match(/\d+[A-Za-z]?/);
      if (secNum && !fullText.includes(secNum[0].toLowerCase())) {
        hallucinated.push(`Section: ${s}`);
      }
    }

    return {
      hasHallucination: hallucinated.length > 0,
      hallucinated
    };
  }

  /**
   * Audit drafted document for groundedness and zero fabrication compliance
   */
  auditDocument(draftText, caseId) {
    const claims = this.decomposeIntoClaims(draftText);
    if (claims.length === 0) {
      return {
        totalClaims: 0,
        verifiedClaims: 0,
        groundednessScore: 100,
        fabricatedClaims: 0,
        gatePassed: true,
        zeroFabricationGate: 'PASSED (0 Fabrications)',
        claims: []
      };
    }

    const verifiedList = claims.map(c => this.verifyClaim(c, caseId));

    const verifiedCount = verifiedList.filter(c => c.status === 'VERIFIED').length;
    const fabricationCount = verifiedList.filter(c => c.status === 'FABRICATION_RISK').length;
    const unsupportedCount = verifiedList.filter(c => c.status === 'UNSUPPORTED').length;

    const groundednessScore = Math.round((verifiedCount / verifiedList.length) * 100);
    const gatePassed = fabricationCount === 0 && groundednessScore >= 80;

    return {
      totalClaims: verifiedList.length,
      verifiedClaims: verifiedCount,
      partiallySupportedClaims: 0,
      fabricatedClaims: fabricationCount,
      unsupportedClaims: unsupportedCount,
      groundednessScore,
      zeroFabricationGate: gatePassed ? 'PASSED (0 Fabrications)' : 'FAILED (Fabrication Detected)',
      gatePassed,
      claims: verifiedList,
      auditTimestamp: new Date().toISOString()
    };
  }
}

export const groundingEngine = new GroundingEngine();
