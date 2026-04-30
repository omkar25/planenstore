import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
       rejectUnauthorized: false,  // helps avoid TLS handshake issues
      },
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #6EB723; padding-bottom: 10px;">
          Neue Kontaktanfrage
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">E-Mail:</td>
            <td style="padding: 8px 0; color: #333;">
              <a href="mailto:${email}" style="color: #6EB723;">${email}</a>
            </td>
          </tr>
          ${
            phone
              ? `<tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Telefon:</td>
            <td style="padding: 8px 0; color: #333;">
              <a href="tel:${phone.replace(/\s/g, "")}" style="color: #6EB723;">${phone}</a>
            </td>
          </tr>`
              : ""
          }
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px 0;">Nachricht:</p>
          <p style="color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Diese Nachricht wurde über das Kontaktformular auf toriplanen.de gesendet.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `Kontaktanfrage von ${name}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Contact form error:", errMsg);
    console.error("SMTP config check — HOST:", process.env.SMTP_HOST, "PORT:", process.env.SMTP_PORT, "USER:", process.env.SMTP_USER ? "set" : "MISSING", "PASS:", process.env.SMTP_PASSWORD ? "set" : "MISSING");
    return NextResponse.json(
      { error: "Failed to send email", details: errMsg },
      { status: 500 }
    );
  }
}
