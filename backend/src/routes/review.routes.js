import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';

const router = Router();

router.post('/', reviewController.getReviewAnalysis);

export default router;
