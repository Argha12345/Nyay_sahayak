import { Router } from 'express';
import { draftController } from '../controllers/draft.controller.js';

const router = Router();

router.post('/', draftController.generateDraft);

export default router;
