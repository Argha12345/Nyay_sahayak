import { db } from '../src/db/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * SQLite-Backed Relational Document Store & Lexical Chunking Indexer
 * Full ACID transactions, relational indexing, and zero external DB service dependencies.
 */
class DocumentStore {
  /**
   * Return all statutory provisions loaded from SQLite
   */
  get statutes() {
    const rows = db.prepare('SELECT * FROM statutes').all();
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      section: r.section,
      title: r.title,
      verifiableText: r.verifiable_text,
      crossReference: r.cross_reference,
      summary: r.summary,
      keywords: JSON.parse(r.keywords || '[]')
    }));
  }

  /**
   * Return all landmark Supreme Court precedents loaded from SQLite
   */
  get precedents() {
    const rows = db.prepare('SELECT * FROM precedents').all();
    return rows.map((r) => ({
      id: r.id,
      caseTitle: r.case_title,
      citation: r.citation,
      court: r.court,
      year: r.year,
      bench: r.bench,
      domain: r.domain,
      ratioDecidendi: r.ratio_decidendi,
      applicabilityTest: r.applicability_test,
      keyQuotes: JSON.parse(r.key_quotes || '[]'),
      keywords: JSON.parse(r.keywords || '[]')
    }));
  }

  /**
   * Return high-level summary of all active cases from SQLite
   */
  getAllCases() {
    const rows = db.prepare(`
      SELECT 
        c.id, c.title, c.type, c.category, c.summary, 
        c.known_contradictions, c.missing_information,
        COUNT(d.id) AS docCount
      FROM cases c
      LEFT JOIN documents d ON c.id = d.case_id
      GROUP BY c.id
      ORDER BY c.created_at ASC
    `).all();

    return rows.map((r) => {
      const contradictions = JSON.parse(r.known_contradictions || '[]');
      const missingInfo = JSON.parse(r.missing_information || '[]');
      return {
        id: r.id,
        title: r.title,
        type: r.type,
        category: r.category,
        summary: r.summary,
        docCount: r.docCount,
        knownContradictionsCount: contradictions.length,
        missingInfoCount: missingInfo.length
      };
    });
  }

  /**
   * Retrieve complete case record with all documents and paragraphs
   */
  getCaseById(caseId) {
    const caseRow = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId);
    if (!caseRow) return null;

    const docRows = db.prepare('SELECT * FROM documents WHERE case_id = ? ORDER BY created_at ASC').all(caseId);
    const paraStmt = db.prepare('SELECT * FROM paragraphs WHERE doc_id = ? ORDER BY para_num ASC');

    const documents = docRows.map((d) => {
      const paragraphs = paraStmt.all(d.id).map((p) => ({
        paraId: p.para_id,
        paraNum: p.para_num,
        text: p.text,
        charCount: p.char_count
      }));

      return {
        id: d.id,
        title: d.title,
        type: d.type,
        date: d.date,
        source: d.source,
        paragraphs
      };
    });

    return {
      id: caseRow.id,
      title: caseRow.title,
      type: caseRow.type,
      category: caseRow.category,
      summary: caseRow.summary,
      groundTruthFacts: JSON.parse(caseRow.ground_truth_facts || '[]'),
      knownContradictions: JSON.parse(caseRow.known_contradictions || '[]'),
      missingInformation: JSON.parse(caseRow.missing_information || '[]'),
      targetWorkflows: JSON.parse(caseRow.target_workflows || '[]'),
      documents
    };
  }

  /**
   * Split raw text into atomic legal paragraphs
   */
  chunkText(rawText, docId, docTitle) {
    if (!rawText) return [];
    const rawParagraphs = rawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

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
   * Register a newly uploaded document or custom case into SQLite
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

    let targetCaseId = caseId;

    const insertCaseStmt = db.prepare(`
      INSERT INTO cases (
        id, title, type, category, summary, 
        ground_truth_facts, known_contradictions, missing_information, target_workflows
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDocStmt = db.prepare(`
      INSERT INTO documents (
        id, case_id, title, type, date, source, content
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertParaStmt = db.prepare(`
      INSERT INTO paragraphs (
        para_id, doc_id, case_id, para_num, text, char_count
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      // If case doesn't exist, create new case envelope
      const existing = targetCaseId ? db.prepare('SELECT id FROM cases WHERE id = ?').get(targetCaseId) : null;
      if (!existing) {
        targetCaseId = targetCaseId || `CASE-CUSTOM-${uuidv4().substring(0, 8).toUpperCase()}`;
        insertCaseStmt.run(
          targetCaseId,
          docData.caseTitle || `Custom Case: ${newDoc.title}`,
          docData.type || 'Ad-Hoc Review',
          'Uploaded Dossier',
          `User provided case documentation with ${newDoc.paragraphs.length} paragraphs.`,
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify([]),
          JSON.stringify(['case_review', 'legal_drafting', 'legal_research', 'rag_chat'])
        );
      }

      // Insert document
      insertDocStmt.run(
        newDoc.id,
        targetCaseId,
        newDoc.title,
        newDoc.type,
        newDoc.date,
        newDoc.source,
        docData.content || ''
      );

      // Insert paragraphs
      for (const p of newDoc.paragraphs) {
        insertParaStmt.run(
          p.paraId,
          newDoc.id,
          targetCaseId,
          p.paraNum,
          p.text,
          p.text.length
        );
      }
    });

    transaction();

    return { caseId: targetCaseId, doc: newDoc };
  }

  /**
   * Collect all atomic chunks for a given case from SQLite
   */
  getAllChunksForCase(caseId) {
    const rows = db.prepare(`
      SELECT 
        p.para_id AS chunkId,
        p.doc_id AS docId,
        d.title AS docTitle,
        d.type AS docType,
        p.para_num AS paraNum,
        p.text AS text,
        'CASE_RECORD' AS sourceType
      FROM paragraphs p
      JOIN documents d ON p.doc_id = d.id
      WHERE p.case_id = ?
      ORDER BY d.id, p.para_num ASC
    `).all(caseId);

    return rows;
  }

  /**
   * Retrieve all chunks across entire system (case chunks + statutes + precedents)
   */
  getGlobalCorpusChunks(caseId) {
    const caseChunks = caseId ? this.getAllChunksForCase(caseId) : [];

    const statuteChunks = this.statutes.map((s) => ({
      chunkId: s.id,
      docId: s.id,
      docTitle: `${s.section} - ${s.title}`,
      docType: 'STATUTE',
      paraNum: 1,
      text: `${s.section}: ${s.title}. ${s.verifiableText} (Summary: ${s.summary})`,
      citation: s.section,
      sourceType: 'STATUTE'
    }));

    const precedentChunks = this.precedents.map((p) => ({
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
