import { ragChatEngine } from '../../services/ragChatEngine.js';

export const chatController = {
  async answerChatQuery(req, res, next) {
    try {
      const { caseId, query, history } = req.body;
      if (!query || !query.trim()) {
        return res.status(400).json({ success: false, error: 'Query is required.' });
      }

      const chatResult = await ragChatEngine.answerQuery(
        query,
        caseId || 'CASE-CRIM-001',
        history || []
      );
      res.json({ success: true, ...chatResult });
    } catch (err) {
      next(err);
    }
  }
};
