import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized') {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class Forbidden extends HttpError {
  constructor(message = 'Forbidden') {
    super(StatusCodes.FORBIDDEN, message);
  }
}

export class NotFound extends HttpError {
  constructor(message = 'Not Found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class Conflict extends HttpError {
  constructor(message = 'Conflict') {
    super(StatusCodes.CONFLICT, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

