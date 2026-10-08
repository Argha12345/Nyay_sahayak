import { researchEngine } from '../../services/researchEngine.js';

export const researchController = {
  researchLegalIssues(req, res, next) {
    try {
      const { caseId, query } = req.body;
      const researchResult = researchEngine.researchLegalIssues(
        caseId || 'CASE-CRIM-001',
        query
      );
      res.json({ success: true, ...researchResult });
    } catch (err) {
      next(err);
    }
  }
};
