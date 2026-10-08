import { Router } from 'express';
import caseRoutes from './case.routes.js';
import reviewRoutes from './review.routes.js';
import draftRoutes from './draft.routes.js';
import researchRoutes from './research.routes.js';
import chatRoutes from './chat.routes.js';
import ablationRoutes from './ablation.routes.js';
import legalDataRoutes from './legalData.routes.js';
import { config } from '../config/index.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: config.systemName,
    version: config.version,
    timestamp: new Date().toISOString()
  });
});

// Domain Routes
apiRouter.use('/cases', caseRoutes);
apiRouter.use('/review', reviewRoutes);
apiRouter.use('/draft', draftRoutes);
apiRouter.use('/research', researchRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/ablation', ablationRoutes);
apiRouter.use('/', legalDataRoutes); // mounts /statutes and /precedents

export default apiRouter;
