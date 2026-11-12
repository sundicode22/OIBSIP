import { prisma, UserCreateInput } from "../configs";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { constants } from "../configs/constants";
import { sendEmail } from "./email.service";

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserByPhone = async (phone: string) => {
  return prisma.user.findFirst({
    where: { phone },
  });
};

export const createUser = async (user: UserCreateInput) => {
  return prisma.user.create({
    data: user,
  });
};

export const createVerificationToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token,
      userId,
    },
  });
  return token;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${constants.CLIENT_URL}/verify-email?token=${token}`;
  const message = `Welcome to Pizza Delivery! Please verify your email by clicking the link: ${verifyUrl}`;
  try {
    await sendEmail(email, "Verify your Pizza Delivery account", message);
  } catch (err) {
    console.error("Failed to send verification email (check SMTP settings):", err);
  }
};

export const verifyEmailToken = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });
  if (!record) {
    return null;
  }
  const updatedUser = await prisma.user.update({
    where: { id: record.userId },
    data: { isEmailVerified: true },
  });
  await prisma.verificationToken.deleteMany({
    where: { userId: record.userId },
  });
  return updatedUser;
};

export const forgotPassword = async (userId: string, email: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token,
      userId,
    },
  });

  const resetUrl = `${constants.CLIENT_URL}/reset-password?token=${token}`;
  const message = `You requested a password reset. Click here to reset your password: ${resetUrl}`;
  try {
    await sendEmail(email, "Reset your Pizza Delivery password", message);
  } catch (err) {
    console.error("Failed to send reset password email:", err);
  }

  return { token, message: "Password reset link sent to email" };
};

export const getUserByToken = async (token: string) => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });
  return verificationToken?.user ?? null;
};

export const resetPassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });
  return updatedUser;
};
