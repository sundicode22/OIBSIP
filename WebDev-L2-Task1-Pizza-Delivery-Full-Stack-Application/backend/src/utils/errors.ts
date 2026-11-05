export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    errors?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errors?: unknown) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized: Please log in to gain access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden: You do not have permission to perform this action") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict detected") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors?: unknown) {
    super(message, 422, errors);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", errors?: unknown) {
    super(message, 500, errors);
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
