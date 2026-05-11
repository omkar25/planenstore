import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ProductInquiryData {
  // Customer info
  name: string;
  email: string;
  phone?: string;
  // Product info
  productName: string;
  productSlug: string;
  productCategory: string;
  productPrice: number;
  // Custom dimensions
  customLaenge: string;
  customBreite: string;
  selectedColor?: string;
  // Additional notes
  anmerkungen?: string;
}

export async function POST(req: Request) {
  try {
    const data: ProductInquiryData = await req.json();

    const {
      name,
      email,
      phone,
      productName,
      productSlug,
      productCategory,
      productPrice,
      customLaenge,
      customBreite,
      selectedColor,
      anmerkungen,
    } = data;

    if (!name || !email || !productName || !customLaenge || !customBreite) {
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
        rejectUnauthorized: false,
      },
    });

    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.toriplanen.de'}/shop/${productSlug}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6EB723 0%, #5a9c1d 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Produktanfrage - Individuelle Größen</h1>
        </div>
        
        <!-- Product Details Section -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-left: 4px solid #6EB723; padding-left: 12px;">
            Produktdetails
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 140px;">Produkt:</td>
              <td style="padding: 10px 0; color: #333;">
                <a href="${productUrl}" style="color: #6EB723; text-decoration: none;">${productName}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Kategorie:</td>
              <td style="padding: 10px 0; color: #333;">${productCategory}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Basispreis:</td>
              <td style="padding: 10px 0; color: #333;">€${productPrice.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <!-- Custom Dimensions Section -->
        <div style="padding: 25px; background: #f8fdf5; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-left: 4px solid #6EB723; padding-left: 12px;">
            Gewünschte Maße
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555; width: 140px;">
                Länge:
              </td>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; color: #333; font-size: 16px;">
                <strong>${customLaenge} cm</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555;">
                Breite:
              </td>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; color: #333; font-size: 16px;">
                <strong>${customBreite} cm</strong>
              </td>
            </tr>
            ${selectedColor ? `
            <tr>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; font-weight: bold; color: #555;">
                Farbe:
              </td>
              <td style="padding: 12px; background: #fff; border: 1px solid #e0e0e0; color: #333;">
                ${selectedColor}
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        <!-- Customer Info Section -->
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-left: 4px solid #6EB723; padding-left: 12px;">
            Kundendaten
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 140px;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">E-Mail:</td>
              <td style="padding: 10px 0; color: #333;">
                <a href="mailto:${email}" style="color: #6EB723;">${email}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Telefon:</td>
              <td style="padding: 10px 0; color: #333;">
                <a href="tel:${phone.replace(/\s/g, '')}" style="color: #6EB723;">${phone}</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        <!-- Notes Section -->
        ${anmerkungen ? `
        <div style="padding: 25px; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; border-left: 4px solid #6EB723; padding-left: 12px;">
            Anmerkungen / Sonderwünsche
          </h2>
          <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; border-left: 3px solid #6EB723;">
            <p style="color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6;">${anmerkungen}</p>
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="padding: 20px; background: #f9f9f9; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #999;">
            Diese Anfrage wurde über das Produktformular auf toriplanen.de gesendet.
          </p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
            <a href="${productUrl}" style="color: #6EB723;">Produkt ansehen →</a>
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `Produktanfrage: ${productName} - Individuelle Größen (${customLaenge}x${customBreite} cm)`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Product inquiry error:", errMsg);
    return NextResponse.json(
      { error: "Failed to send inquiry", details: errMsg },
      { status: 500 }
    );
  }
}
