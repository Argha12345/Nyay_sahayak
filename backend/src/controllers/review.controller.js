import { documentStore } from '../../services/documentStore.js';
import { contradictionEngine } from '../../services/contradictionEngine.js';
import { missingInfoEngine } from '../../services/missingInfoEngine.js';

export const reviewController = {
  getReviewAnalysis(req, res, next) {
    try {
      const { caseId } = req.body;
      const targetCase = documentStore.getCaseById(caseId || 'CASE-CRIM-001');
      if (!targetCase) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }

      // 1. Cross-Document Contradiction Analysis
      const contradictions = contradictionEngine.detectContradictions(targetCase.id);

      // 2. Pre-Drafting Evidentiary & Missing-Info Audit
      const missingInfoAudit = missingInfoEngine.generateAuditReport(targetCase.id);

      // 3. Extract verified factual assertions
      const allChunks = documentStore.getAllChunksForCase(targetCase.id);
      const facts = (targetCase.groundTruthFacts && targetCase.groundTruthFacts.length > 0)
        ? targetCase.groundTruthFacts
        : allChunks.slice(0, 6).map((c) => ({
            fact: c.text.length > 140 ? c.text.substring(0, 140) + '...' : c.text,
            sourceDocId: c.docId,
            paraId: c.chunkId,
            verbatimSpan: c.text.length > 80 ? c.text.substring(0, 80) : c.text
          }));

      res.json({
        success: true,
        caseId: targetCase.id,
        caseTitle: targetCase.title,
        summary: targetCase.summary,
        keyFacts: facts,
        contradictions,
        missingInfoAudit,
        totalDocuments: targetCase.documents?.length || 0,
        documentsList: (targetCase.documents || []).map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          paragraphCount: d.paragraphs?.length || 0
        }))
      });
    } catch (err) {
      next(err);
    }
  }
};
