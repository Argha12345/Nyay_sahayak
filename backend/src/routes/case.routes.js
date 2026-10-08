import { Router } from 'express';
import { caseController } from '../controllers/case.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', caseController.getAllCases);
router.get('/:id', caseController.getCaseById);
router.post('/upload', upload.single('file'), caseController.uploadDocument);

export default router;
