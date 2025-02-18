import resend from "../config/resend.js"
export const sendMail = async({to,subject,text,html}) =>
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:"delivered@resend.dev",
        subject,
        text,
        html,
    });