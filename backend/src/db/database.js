import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SAMPLE_CASES } from '../../data/sampleCases.js';
import { STATUTES_CORPUS } from '../../data/statutesCorpus.js';
import { PRECEDENTS_CORPUS } from '../../data/precedentsCorpus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.resolve(DB_DIR, 'verijuris.db');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize SQLite connection
export const db = new Database(DB_PATH);

// Configure SQLite for high performance and integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialize Schema & Seed Tables if empty
 */
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      category TEXT,
      summary TEXT,
      ground_truth_facts TEXT,
      known_contradictions TEXT,
      missing_information TEXT,
      target_workflows TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT,
      date TEXT,
      source TEXT,
      content TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS paragraphs (
      para_id TEXT PRIMARY KEY,
      doc_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      para_num INTEGER NOT NULL,
      text TEXT NOT NULL,
      char_count INTEGER,
      FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS statutes (
      id TEXT PRIMARY KEY,
      code TEXT,
      section TEXT,
      title TEXT,
      verifiable_text TEXT,
      cross_reference TEXT,
      summary TEXT,
      keywords TEXT
    );

    CREATE TABLE IF NOT EXISTS precedents (
      id TEXT PRIMARY KEY,
      case_title TEXT,
      citation TEXT,
      court TEXT,
      year INTEGER,
      bench TEXT,
      domain TEXT,
      ratio_decidendi TEXT,
      applicability_test TEXT,
      key_quotes TEXT,
      keywords TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_paragraphs_case ON paragraphs(case_id);
    CREATE INDEX IF NOT EXISTS idx_paragraphs_doc ON paragraphs(doc_id);
    CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);
  `);

  // Seed default cases if cases table is empty
  const caseCount = db.prepare('SELECT COUNT(*) as count FROM cases').get().count;
  if (caseCount === 0) {
    seedDatabase();
  }

  // Ensure high-capacity 1,200+ bulk dataset is seeded
  const statuteCount = db.prepare('SELECT COUNT(*) as count FROM statutes').get().count;
  if (statuteCount < 100) {
    import('./bulkDatasetSeeder.js').then(({ seedBulkLegalDataset }) => {
      seedBulkLegalDataset();
    }).catch(err => {
      console.error('[SQLite] Failed to run bulk dataset seeder:', err);
    });
  }
}

/**
 * Seed initial benchmark legal data into SQLite
 */
export function seedDatabase() {
  const insertCase = db.prepare(`
    INSERT OR REPLACE INTO cases (
      id, title, type, category, summary, 
      ground_truth_facts, known_contradictions, missing_information, target_workflows
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDoc = db.prepare(`
    INSERT OR REPLACE INTO documents (
      id, case_id, title, type, date, source, content
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPara = db.prepare(`
    INSERT OR REPLACE INTO paragraphs (
      para_id, doc_id, case_id, para_num, text, char_count
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertStatute = db.prepare(`
    INSERT OR REPLACE INTO statutes (
      id, code, section, title, verifiable_text, cross_reference, summary, keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPrecedent = db.prepare(`
    INSERT OR REPLACE INTO precedents (
      id, case_title, citation, court, year, bench, domain, 
      ratio_decidendi, applicability_test, key_quotes, keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    // 1. Seed Cases, Documents & Paragraphs
    for (const c of SAMPLE_CASES) {
      insertCase.run(
        c.id,
        c.title,
        c.type,
        c.category,
        c.summary,
        JSON.stringify(c.groundTruthFacts || []),
        JSON.stringify(c.knownContradictions || []),
        JSON.stringify(c.missingInformation || []),
        JSON.stringify(c.targetWorkflows || [])
      );

      for (const doc of c.documents || []) {
        insertDoc.run(
          doc.id,
          c.id,
          doc.title,
          doc.type,
          doc.date,
          doc.source,
          doc.paragraphs ? doc.paragraphs.map(p => p.text).join('\n\n') : ''
        );

        for (const p of doc.paragraphs || []) {
          insertPara.run(
            p.paraId,
            doc.id,
            c.id,
            p.paraNum,
            p.text,
            p.text.length
          );
        }
      }
    }

    // 2. Seed Statutes
    for (const s of STATUTES_CORPUS) {
      insertStatute.run(
        s.id,
        s.code,
        s.section,
        s.title,
        s.verifiableText,
        s.crossReference,
        s.summary,
        JSON.stringify(s.keywords || [])
      );
    }

    // 3. Seed Precedents
    for (const p of PRECEDENTS_CORPUS) {
      insertPrecedent.run(
        p.id,
        p.caseTitle,
        p.citation,
        p.court,
        p.year,
        p.bench,
        p.domain,
        p.ratioDecidendi,
        p.applicabilityTest,
        JSON.stringify(p.keyQuotes || []),
        JSON.stringify(p.keywords || [])
      );
    }
  });

  transaction();
  console.log('[SQLite Database] Seeded initial cases, statutes, and precedents successfully.');
}

// Auto-initialize on import
initDatabase();
