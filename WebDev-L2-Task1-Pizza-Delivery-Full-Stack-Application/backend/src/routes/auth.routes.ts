import { Router } from "express";
import {
  login,
  adminLogin,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controller/auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", login);
authRouter.post("/admin-login", adminLogin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export { authRouter };
