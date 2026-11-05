import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "node:crypto";
import { constants } from "../configs/constants";
import { UnauthorizedError } from "./errors";

export interface TokenPayload {
  id: string;
  role: string;
  email?: string;
  [key: string]: unknown;
}

export const generateToken = (
  payload: TokenPayload,
  expiresIn: string | number = constants.JWT_EXPIRES_IN || "7d",
): string => {
  if (!constants.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables");
  }

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, constants.JWT_SECRET, options);
};

export const verifyToken = <T = TokenPayload>(token: string): T => {
  if (!constants.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables");
  }

  try {
    return jwt.verify(token, constants.JWT_SECRET) as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token has expired. Please log in again.");
    }
    throw new UnauthorizedError("Invalid authentication token.");
  }
};

export const generateRandomToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
