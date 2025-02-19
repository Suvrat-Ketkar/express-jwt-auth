import resend from "../config/resend.js"
import { EMAIL_SENDER, NODE_ENV } from "../constants/env.js";
const getFromEmail = () =>
    NODE_ENV === "DEVELOPMENT" ? "onboarding@resend.dev" : EMAIL_SENDER;
  
  const getToEmail = (to) =>
    NODE_ENV === "DEVELOPMENT" ? "delivered@resend.dev" : to;

export const sendMail = async({to,subject,text,html}) =>
    await resend.emails.send({
        from:getFromEmail(),
        to:getToEmail(to),
        subject,
        text,
        html,
    });