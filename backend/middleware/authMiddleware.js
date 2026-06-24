import jwt from 'jsonwebtoken';
import { Unauthorized } from '../utils/httpErrors.js';

/**
 * JWT authentication middleware.
 *
 * Expects: Authorization: Bearer <token>
 *
 * On success attaches:
 *   req.user = { userId: ..., email: ... }
 */
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new Unauthorized('Missing or invalid Authorization header');
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // payload includes userId (set in auth controller)
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (err) {
    return next(new Unauthorized(err.message || 'Unauthorized'));
  }
}

