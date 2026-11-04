import { emailConfig } from "../configs/email.js";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mail = await emailConfig.sendMail({
    from: emailConfig.options.auth?.user,
    to,
    subject,
    text,
  });
  return mail;
};
