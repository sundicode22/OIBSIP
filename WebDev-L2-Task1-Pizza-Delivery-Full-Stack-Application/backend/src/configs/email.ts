import nodemailer from "nodemailer";
import { constants } from "./constants.js";
import "dotenv/config";

export const emailConfig = nodemailer.createTransport({
  host: constants.EMAIL_HOST,
  port: constants.EMAIL_PORT,
  auth: {
    user: constants.EMAIL_USER,
    pass: constants.EMAIL_PASSWORD,
  },
});
