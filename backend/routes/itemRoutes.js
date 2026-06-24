import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  markReturned
} from '../controllers/itemController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public read endpoints
router.get(
  '/',
  [
    // MVP spec: keyword
    query('keyword').optional().isString(),
    // Backward-compatible alias
    query('search').optional().isString(),
    query('category').optional().isString(),
    query('location').optional().isString(),
    query('status').optional().isIn(['lost', 'found']).withMessage('status must be lost|found')
  ],
  validate,
  getAllItems
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('invalid item id')],
  validate,
  getItemById
);

// Protected write endpoints
router.use(requireAuth);

// POST /api/items
router.post(
  '/',
  upload.single('image'),
  [
    body('title').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('category').isString().notEmpty(),
    body('location').isString().notEmpty(),
    body('status').isIn(['lost', 'found']),
    body('date').optional().isISO8601().toDate()
  ],
  validate,
  createItem
);

// PUT /api/items/:id
router.put(
  '/:id',
  upload.single('image'),
  [
    param('id').isMongoId().withMessage('invalid item id'),
    body('title').optional().isString().notEmpty(),
    body('description').optional().isString().notEmpty(),
    body('category').optional().isString().notEmpty(),
    body('location').optional().isString().notEmpty(),
    body('status').optional().isIn(['lost', 'found']),
    body('date').optional().isISO8601().toDate()
  ],
  validate,
  updateItem
);

// DELETE /api/items/:id
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('invalid item id')],
  validate,
  deleteItem
);

// PUT /api/items/:id/return
router.put(
  '/:id/return',
  [param('id').isMongoId().withMessage('invalid item id')],
  validate,
  markReturned
);

export default router;

