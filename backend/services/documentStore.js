import { SAMPLE_CASES } from '../data/sampleCases.js';
import { STATUTES_CORPUS } from '../data/statutesCorpus.js';
import { PRECEDENTS_CORPUS } from '../data/precedentsCorpus.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CUSTOM_CASES_FILE = path.resolve(__dirname, '../data/customCases.json');

/**
 * In-Memory & File-Persistent Document Store & Lexical Chunking Indexer
 */
class DocumentStore {
  constructor() {
    this.cases = new Map();
    this.customDocs = new Map();
    this.statutes = STATUTES_CORPUS;
    this.precedents = PRECEDENTS_CORPUS;

    // Load initial benchmark cases
    for (const c of SAMPLE_CASES) {
      this.cases.set(c.id, JSON.parse(JSON.stringify(c)));
    }

    // Load persisted custom cases from disk
    this.loadCustomCases();
  }

  loadCustomCases() {
    try {
      if (fs.existsSync(CUSTOM_CASES_FILE)) {
        const data = fs.readFileSync(CUSTOM_CASES_FILE, 'utf-8');
        const customCases = JSON.parse(data);
        for (const [id, c] of Object.entries(customCases)) {
          this.cases.set(id, c);
        }
      }
    } catch (e) {
      console.warn('[DocumentStore] Could not load persisted cases:', e.message);
    }
  }

  saveCustomCases() {
    try {
      const sampleMap = new Map(SAMPLE_CASES.map(c => [c.id, c]));
      const toSave = {};
      for (const [id, c] of this.cases.entries()) {
        const seed = sampleMap.get(id);
        // Persist if it's a new custom case or if documents were added to an existing case
        if (!seed || c.documents?.length > (seed.documents?.length || 0)) {
          toSave[id] = c;
        }
      }
      fs.writeFileSync(CUSTOM_CASES_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[DocumentStore] Could not persist cases:', e.message);
    }
  }

  getAllCases() {
    return Array.from(this.cases.values()).map(c => ({
      id: c.id,
      title: c.title,
      type: c.type,
      category: c.category,
      summary: c.summary,
      docCount: c.documents?.length || 0,
      knownContradictionsCount: c.knownContradictions?.length || 0,
      missingInfoCount: c.missingInformation?.length || 0
    }));
  }

  getCaseById(caseId) {
    return this.cases.get(caseId) || null;
  }

  /**
   * Split raw text into atomic legal paragraphs
   */
  chunkText(rawText, docId, docTitle) {
    if (!rawText) return [];
    // Split on double newlines or paragraph patterns
    const rawParagraphs = rawText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20);

    return rawParagraphs.map((text, idx) => {
      const paraNum = idx + 1;
      return {
        paraId: `${docId}:P${paraNum}`,
        paraNum,
        docId,
        docTitle,
        text,
        charCount: text.length
      };
    });
  }

  /**
   * Register a newly uploaded document or custom case
   */
  addCustomDocument(caseId, docData) {
    const docId = docData.id || `DOC-USER-${uuidv4().substring(0, 8).toUpperCase()}`;
    const chunks = this.chunkText(docData.content || '', docId, docData.title || 'Uploaded Document');

    const newDoc = {
      id: docId,
      title: docData.title || 'Custom Uploaded Document',
      type: docData.type || 'Custom Evidence',
      date: docData.date || new Date().toISOString().split('T')[0],
      source: docData.source || 'User Upload',
      paragraphs: chunks.length > 0 ? chunks : [
        {
          paraId: `${docId}:P1`,
          paraNum: 1,
          text: docData.content || '',
          charCount: (docData.content || '').length
        }
      ]
    };

    let result;
    if (caseId && this.cases.has(caseId)) {
      const existingCase = this.cases.get(caseId);
      existingCase.documents = existingCase.documents || [];
      existingCase.documents.push(newDoc);
      result = { caseId, doc: newDoc };
    } else {
      // Create new case envelope
      const newCaseId = caseId || `CASE-CUSTOM-${uuidv4().substring(0, 8).toUpperCase()}`;
      const newCase = {
        id: newCaseId,
        title: docData.caseTitle || `Custom Case: ${newDoc.title}`,
        type: docData.type || 'Ad-Hoc Review',
        category: 'Uploaded Dossier',
        summary: `User provided case documentation with ${newDoc.paragraphs.length} paragraphs.`,
        documents: [newDoc],
        groundTruthFacts: [],
        knownContradictions: [],
        missingInformation: []
      };
      this.cases.set(newCaseId, newCase);
      result = { caseId: newCaseId, doc: newDoc };
    }

    // Persist to disk so refresh and restarts retain the uploaded dossier
    this.saveCustomCases();
    return result;
  }

  /**
   * Collect all atomic chunks for a given case plus statutory/precedent reference library
   */
  getAllChunksForCase(caseId) {
    const targetCase = this.getCaseById(caseId);
    if (!targetCase || !targetCase.documents) return [];

    const chunks = [];
    for (const doc of targetCase.documents) {
      if (!doc.paragraphs) continue;
      for (const p of doc.paragraphs) {
        chunks.push({
          chunkId: p.paraId,
          docId: doc.id,
          docTitle: doc.title,
          docType: doc.type,
          paraNum: p.paraNum,
          text: p.text,
          sourceType: 'CASE_RECORD'
        });
      }
    }

    return chunks;
  }

  /**
   * Retrieve all chunks across entire system (case chunks + statutes + precedents)
   */
  getGlobalCorpusChunks(caseId) {
    const caseChunks = caseId ? this.getAllChunksForCase(caseId) : [];

    const statuteChunks = this.statutes.map(s => ({
      chunkId: s.id,
      docId: s.id,
      docTitle: `${s.section} - ${s.title}`,
      docType: 'STATUTE',
      paraNum: 1,
      text: `${s.section}: ${s.title}. ${s.verifiableText} (Summary: ${s.summary})`,
      citation: s.section,
      sourceType: 'STATUTE'
    }));

    const precedentChunks = this.precedents.map(p => ({
      chunkId: p.id,
      docId: p.id,
      docTitle: `${p.caseTitle} [${p.citation}]`,
      docType: 'PRECEDENT',
      paraNum: 1,
      text: `${p.caseTitle}, ${p.citation}. Bench: ${p.bench}. Ratio: ${p.ratioDecidendi}. Key Holdings: ${p.keyQuotes.join(' ')}`,
      citation: p.citation,
      sourceType: 'PRECEDENT'
    }));

    return [...caseChunks, ...statuteChunks, ...precedentChunks];
  }
}

export const documentStore = new DocumentStore();
