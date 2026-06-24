import { validationResult } from 'express-validator';
import { BadRequest } from '../utils/httpErrors.js';

/**
 * express-validator middleware helper.
 */
export function validate(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new BadRequest(result.array().map(e => e.msg).join(', ')));
  }
  return next();
}

