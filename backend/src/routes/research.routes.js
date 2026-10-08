import { Router } from 'express';
import { researchController } from '../controllers/research.controller.js';

const router = Router();

router.post('/', researchController.researchLegalIssues);

export default router;
