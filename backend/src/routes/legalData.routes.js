import { Router } from 'express';
import { legalDataController } from '../controllers/legalData.controller.js';

const router = Router();

router.get('/statutes', legalDataController.getStatutes);
router.get('/precedents', legalDataController.getPrecedents);

export default router;
