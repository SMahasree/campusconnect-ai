import { Router } from 'express';

import { getMatches } from '../controllers/matchingController.js';

const router = Router();

// GET /api/matches?itemType=lost|found (optional)
// Returns potential matches based on similarity.
router.get('/', getMatches);

export default router;

