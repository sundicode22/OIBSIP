import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, NotFoundError } from "../utils/errors";
import { errorResponse } from "../utils/response";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    errorResponse(res, err.statusCode, err.message, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    errorResponse(res, 422, "Validation failed", formattedErrors);
    return;
  }

  // Handle Prisma Known Request errors
  if (typeof err === "object" && err !== null && "code" in err) {
    const prismaError = err as { code: string; meta?: Record<string, unknown> };
    if (prismaError.code === "P2002") {
      errorResponse(res, 409, "A record with this unique field already exists");
      return;
    }
    if (prismaError.code === "P2025") {
      errorResponse(res, 404, "Requested record was not found");
      return;
    }
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  console.error("Unhandled Error:", err);
  errorResponse(res, 500, message);
};
