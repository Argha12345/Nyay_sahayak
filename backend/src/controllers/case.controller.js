import { documentStore } from '../../services/documentStore.js';

export const caseController = {
  // Get all active and stored cases
  getAllCases(req, res, next) {
    try {
      const cases = documentStore.getAllCases();
      res.json({ success: true, count: cases.length, cases });
    } catch (err) {
      next(err);
    }
  },

  // Get specific case by ID
  getCaseById(req, res, next) {
    try {
      const c = documentStore.getCaseById(req.params.id);
      if (!c) {
        return res.status(404).json({ success: false, error: 'Case not found' });
      }
      res.json({ success: true, case: c });
    } catch (err) {
      next(err);
    }
  },

  // Ingest uploaded custom document or create new dossier
  async uploadDocument(req, res, next) {
    try {
      const { caseId, title, type, content, caseTitle } = req.body;
      let fileContent = content || '';

      if (req.file) {
        if (req.file.mimetype === 'application/pdf') {
          try {
            const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
            const pdfData = await pdfParse(req.file.buffer);
            fileContent = pdfData.text;
          } catch (e) {
            fileContent = req.file.buffer.toString('utf-8');
          }
        } else {
          fileContent = req.file.buffer.toString('utf-8');
        }
      }

      if (!fileContent.trim()) {
        return res.status(400).json({
          success: false,
          error: 'No text content provided or extractable from file.'
        });
      }

      const result = documentStore.addCustomDocument(caseId, {
        title: title || req.file?.originalname || 'Uploaded Document',
        type: type || 'Contract / Deposition',
        content: fileContent,
        caseTitle: caseTitle || 'Uploaded Legal Dossier'
      });

      res.json({
        success: true,
        message: 'Document ingested and indexed successfully with persistent storage',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }
};
