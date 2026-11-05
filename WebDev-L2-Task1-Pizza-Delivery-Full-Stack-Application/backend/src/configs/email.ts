import nodemailer from "nodemailer";
import { constants } from "./constants";
import "dotenv/config";

export const emailConfig = nodemailer.createTransport({
  host: constants.EMAIL_HOST,
  port: constants.EMAIL_PORT ? Number(constants.EMAIL_PORT) : 587,
  auth: {
    user: constants.EMAIL_USER,
    pass: constants.EMAIL_PASSWORD,
  },
});

export const emailTransporter = emailConfig;
