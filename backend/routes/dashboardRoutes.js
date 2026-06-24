import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = Router();
router.use(requireAuth);

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;

