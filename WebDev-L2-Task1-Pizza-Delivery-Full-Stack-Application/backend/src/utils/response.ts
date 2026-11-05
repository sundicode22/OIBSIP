import type { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const successResponse = <T>(
  res: Response,
  statusCode = 200,
  data?: T,
  message?: string,
): Response => {
  const body: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(body);
};

export const errorResponse = (
  res: Response,
  statusCode = 500,
  message = "An error occurred",
  errors?: unknown,
): Response => {
  const body: ApiResponse = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  return res.status(statusCode).json(body);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
): Response => {
  const totalPages = Math.ceil(total / limit) || 1;
  const body: ApiResponse<T[]> = {
    success: true,
    ...(message && { message }),
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
  return res.status(200).json(body);
};
