import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM;

const resend = apiKey ? new Resend(apiKey) : null;

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!from) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const response = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
  return response;
}
