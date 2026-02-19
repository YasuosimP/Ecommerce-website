import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function sendOrderEmail(to: string, orderId: string) {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "shop@tunisia-marketplace.local",
      to,
      subject: `Order ${orderId} confirmed`,
      html: `<p>Thank you for your order #${orderId}</p>`
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "shop@tunisia-marketplace.local",
    to,
    subject: `Order ${orderId} confirmed`,
    text: `Thank you for your order #${orderId}`
  });
}
