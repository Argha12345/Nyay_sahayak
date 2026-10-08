import { Router } from 'express';
import { ablationController } from '../controllers/ablation.controller.js';

const router = Router();

router.post('/', ablationController.runBenchmark);

export default router;
