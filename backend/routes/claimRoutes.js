import { Router } from 'express';
import { body, param } from 'express-validator';

import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createClaim,
  listClaims,
  updateClaim
} from '../controllers/claimController.js';

const router = Router();
router.use(requireAuth);

// POST /api/claims
router.post(
  '/',
  [
    body('itemId').isMongoId().withMessage('itemId must be a valid Mongo id'),
    body('message').optional().isString()
  ],
  validate,
  createClaim
);

// GET /api/claims
router.get('/', listClaims);

// PUT /api/claims/:id
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('invalid claim id'),
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('status must be pending|approved|rejected')
  ],
  validate,
  updateClaim
);

export default router;

