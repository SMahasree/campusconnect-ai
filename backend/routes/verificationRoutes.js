import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createVerification, 
  listVerifications, 
  approveVerification, 
  rejectVerification 
} from '../controllers/verificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(requireAuth);

/**
 * POST /api/verifications
 * Create verification for a claim
 */
router.post(
  '/',
  upload.single('proofPhoto'),
  [
    body('claimId').isMongoId(),
    body('proofDescription').optional().isString()
  ],
  validate,
  createVerification
);

/**
 * GET /api/verifications
 * Get user's verifications (as owner or finder)
 */
router.get('/', listVerifications);

/**
 * PUT /api/verifications/:id/approve
 * Approve a verification
 */
router.put(
  '/:id/approve',
  [body('ownerNotes').optional().isString()],
  validate,
  approveVerification
);

/**
 * PUT /api/verifications/:id/reject
 * Reject a verification
 */
router.put(
  '/:id/reject',
  [body('ownerNotes').optional().isString()],
  validate,
  rejectVerification
);

export default router;
