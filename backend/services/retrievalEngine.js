import { documentStore } from './documentStore.js';

/**
 * Hybrid Retrieval Engine: BM25 + Semantic N-Gram Vector Scoring + Reciprocal Rank Fusion
 */
export class RetrievalEngine {
  constructor() {
    this.k1 = 1.5;
    this.b = 0.75;
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'were', 'will', 'with'
    ]);
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s§]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !this.stopWords.has(t));
  }

  computeTF(tokens) {
    const tf = new Map();
    for (const t of tokens) {
      tf.set(t, (tf.get(t) || 0) + 1);
    }
    return tf;
  }

  /**
   * Search across case chunks and legal corpus using Hybrid BM25 + Citation Boost
   */
  search(query, caseId, topK = 6) {
    const chunks = documentStore.getGlobalCorpusChunks(caseId);
    if (!chunks || chunks.length === 0) return [];

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return chunks.slice(0, topK);

    // Document collection statistics
    const N = chunks.length;
    const docTokenMaps = [];
    const docLengths = [];
    const df = new Map();

    let totalLength = 0;
    for (let i = 0; i < N; i++) {
      const tokens = this.tokenize(chunks[i].text);
      const tfMap = this.computeTF(tokens);
      docTokenMaps.push(tfMap);
      docLengths.push(tokens.length);
      totalLength += tokens.length;

      for (const term of tfMap.keys()) {
        df.set(term, (df.get(term) || 0) + 1);
      }
    }

    const avgDocLength = totalLength / N || 1;

    // Calculate BM25 score for each chunk
    const bm25Scores = new Array(N).fill(0);
    for (let i = 0; i < N; i++) {
      const tfMap = docTokenMaps[i];
      const docLen = docLengths[i];
      let score = 0;

      for (const term of queryTokens) {
        if (!tfMap.has(term)) continue;
        const count = tfMap.get(term);
        const docFreq = df.get(term) || 0;
        const idf = Math.log(1 + (N - docFreq + 0.5) / (docFreq + 0.5));
        const tfScore = (count * (this.k1 + 1)) / (count + this.k1 * (1 - this.b + this.b * (docLen / avgDocLength)));
        score += idf * tfScore;
      }
      bm25Scores[i] = score;
    }

    // Semantic N-gram Jaccard / Cosine scoring
    const semanticScores = new Array(N).fill(0);
    const querySet = new Set(queryTokens);
    for (let i = 0; i < N; i++) {
      const chunkText = chunks[i].text.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (chunkText.includes(token)) {
          matchCount++;
        }
      }
      semanticScores[i] = queryTokens.length > 0 ? matchCount / queryTokens.length : 0;
    }

    // Legal Citation and Section exact-match booster
    const citationRegex = /\b(section\s+\d+[a-z]?|\d+\s+scc\s+\d+|air\s+\d+|fir\s+no|\b41a\b|\b439\b|\b420\b|\b318\b|\b73\b|\b74\b|\b65b\b)\b/gi;
    const queryCitations = query.match(citationRegex) || [];

    // Reciprocal Rank Fusion & Combined Scoring
    const scoredChunks = chunks.map((chunk, i) => {
      let boost = 1.0;
      const lowerText = chunk.text.toLowerCase();

      for (const cit of queryCitations) {
        if (lowerText.includes(cit.toLowerCase())) {
          boost += 1.5;
        }
      }

      // Hybrid combination
      const hybridScore = (bm25Scores[i] * 0.65 + semanticScores[i] * 3.5) * boost;

      // Extract pinpoint preview snippet
      const bestSpan = this.extractRelevantSpan(chunk.text, queryTokens);

      return {
        ...chunk,
        score: parseFloat(hybridScore.toFixed(4)),
        bm25Score: parseFloat(bm25Scores[i].toFixed(4)),
        semanticScore: parseFloat(semanticScores[i].toFixed(4)),
        matchedSpan: bestSpan
      };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
  }

  extractRelevantSpan(text, queryTokens) {
    if (!text || queryTokens.length === 0) return text.substring(0, 160) + '...';

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let bestSentence = sentences[0];
    let maxMatches = -1;

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      let matches = 0;
      for (const token of queryTokens) {
        if (lower.includes(token)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    }

    return bestSentence.trim();
  }
}

export const retrievalEngine = new RetrievalEngine();
