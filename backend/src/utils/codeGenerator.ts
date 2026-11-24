import crypto from "crypto";
import QRCode from "qrcode";

/**
 * Generate a unique verification code for a product
 * Format: TV-{COMPANY_PREFIX}-{RANDOM}-{YEAR}
 */
export function generateVerificationCode(companyName: string): string {
  const prefix = companyName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `TV-${prefix}-${random}-${year}`;
}

/**
 * Generate multiple unique verification codes
 */
export function generateBulkCodes(companyName: string, count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generateVerificationCode(companyName));
  }
  return Array.from(codes);
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(verificationUrl: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#1a56db",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
    return qrDataUrl;
  } catch (error) {
    console.error("QR Code generation failed:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Build the verification URL for a given code
 */
export function buildVerificationUrl(code: string): string {
  const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3000";
  return `${baseUrl}/verify/${code}`;
}
