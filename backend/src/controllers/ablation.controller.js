import { ablationEngine } from '../../services/ablationEngine.js';

export const ablationController = {
  async runBenchmark(req, res, next) {
    try {
      const { caseId, query } = req.body;
      const ablationResult = await ablationEngine.runComparativeBenchmark(
        caseId || 'CASE-CRIM-001',
        query
      );
      res.json({ success: true, benchmark: ablationResult });
    } catch (err) {
      next(err);
    }
  }
};
