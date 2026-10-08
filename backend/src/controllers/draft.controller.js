import { draftingEngine } from '../../services/draftingEngine.js';

export const draftController = {
  generateDraft(req, res, next) {
    try {
      const { caseId, templateType, customInstructions } = req.body;
      const draftResult = draftingEngine.draftDocument(
        caseId || 'CASE-CRIM-001',
        templateType || 'bail_application',
        customInstructions
      );
      res.json({ success: true, ...draftResult });
    } catch (err) {
      next(err);
    }
  }
};
