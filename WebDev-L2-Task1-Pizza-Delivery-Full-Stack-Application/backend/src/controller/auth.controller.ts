import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  adminLoginSchema,
  verifyEmailSchema,
} from "../schema/auth.schema";
import {
  successResponse,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  generateToken,
  comparePassword,
  hashPassword,
} from "../utils";
import { userService } from "../services";
import { Roles } from "../configs";

export const register = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name, phone } = await registerSchema.parseAsync(req.body);

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("An account with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await userService.createUser({
      email,
      name,
      phone,
      password: hashedPassword,
      role: Roles.USER,
      isEmailVerified: false,
    });

    // Generate & send verification token
    const token = await userService.createVerificationToken(newUser.id);
    await userService.sendVerificationEmail(newUser.email, token);

    successResponse(
      res,
      201,
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
      "Registration successful! Please check your email to verify your account.",
    );
  },
);

export const verifyEmail = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const token = (Array.isArray(req.params.token) ? req.params.token[0] : req.params.token || req.query.token) as string;
    await verifyEmailSchema.parseAsync({ token });

    const user = await userService.verifyEmailToken(token);
    if (!user) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    successResponse(
      res,
      200,
      { id: user.id, email: user.email, isEmailVerified: true },
      "Email verified successfully. You can now log in.",
    );
  },
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = await loginSchema.parseAsync(req.body);

    const existingUser = await userService.getUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken({
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    successResponse(res, 200, {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        isEmailVerified: existingUser.isEmailVerified,
      },
    });
  },
);

export const adminLogin = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = await adminLoginSchema.parseAsync(req.body);

    const existingUser = await userService.getUserByEmail(email);
    if (!existingUser) {
      throw new UnauthorizedError("Invalid admin credentials");
    }

    if (existingUser.role !== Roles.ADMIN) {
      throw new ForbiddenError("Access denied: Not an administrative account");
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid admin credentials");
    }

    const token = generateToken({
      id: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
    });

    successResponse(res, 200, {
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  },
);

export const forgotPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email } = await forgotPasswordSchema.parseAsync(req.body);

    const existingUser = await userService.getUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundError("User with this email was not found");
    }

    const result = await userService.forgotPassword(existingUser.id, existingUser.email);
    successResponse(res, 200, result, "Password reset link sent to your email");
  },
);

export const resetPassword = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { password, token } = await resetPasswordSchema.parseAsync(req.body);

    const existingUser = await userService.getUserByToken(token);
    if (!existingUser) {
      throw new BadRequestError("Invalid or expired password reset token");
    }

    const updatedUser = await userService.resetPassword(
      existingUser.id,
      password,
    );

    successResponse(
      res,
      200,
      { id: updatedUser.id, email: updatedUser.email },
      "Password has been reset successfully",
    );
  },
);
