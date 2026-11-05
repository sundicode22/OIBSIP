import type { Request, Response, NextFunction } from "express";
import { verifyToken, type TokenPayload } from "../utils/token";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { Roles } from "../configs";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication token is missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  req.user = decoded;
  next();
};

export const requireRoles = (...allowedRoles: (Roles | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Requires one of roles: ${allowedRoles.join(", ")}`,
      );
    }

    next();
  };
};
