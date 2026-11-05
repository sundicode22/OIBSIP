import { emailConfig } from "../configs/email";
import { constants } from "../configs/constants";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mail = await emailConfig.sendMail({
    from: constants.EMAIL_FROM || constants.EMAIL_USER,
    to,
    subject,
    text,
  });
  return mail;
};
