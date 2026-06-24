import { Router } from 'express';
import { body } from 'express-validator';

import { register, login, googleLogin } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('valid email is required'),
    body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 chars')
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('valid email is required'),
    body('password').isString().notEmpty().withMessage('password is required')
  ],
  validate,
  login
);

// POST /api/auth/google-login
router.post(
  '/google-login',
  [
    body('token').isString().notEmpty().withMessage('ID token is required')
  ],
  validate,
  googleLogin
);

export default router;

