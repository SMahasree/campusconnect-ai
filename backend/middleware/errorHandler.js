/**
 * Centralized error handler.
 *
 * Controllers can throw HttpError subclasses.
 * Validation middleware returns 400.
 */
import { HttpError, InternalServerError } from '../utils/httpErrors.js';
import { StatusCodes } from 'http-status-codes';

export function notFound(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  const isProd = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    message,
    ...(isProd ? {} : { stack: err.stack })
  });
}

