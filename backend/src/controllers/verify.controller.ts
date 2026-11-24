import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { verifyCodeSchema, counterfeitReportSchema } from "../utils/validators";
import { AppError } from "../middleware/errorHandler";

const SUSPICIOUS_SCAN_THRESHOLD = 5;

// GET /api/verify/:code — PUBLIC endpoint
export const verifyProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;

    const parsed = verifyCodeSchema.safeParse({ code });
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    // Find verification code
    const verificationCode = await prisma.verificationCode.findUnique({
      where: { uniqueCode: code },
      include: {
        product: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
                website: true,
                city: true,
                country: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!verificationCode) {
      // Log the failed scan attempt
      return res.json({
        status: "success",
        data: {
          result: "NOT_FOUND",
          message: "This verification code was not found in our system. The product may be counterfeit.",
          code,
        },
      });
    }

    // Check if deactivated
    if (verificationCode.status === "DEACTIVATED") {
      return res.json({
        status: "success",
        data: {
          result: "NOT_FOUND",
          message: "This verification code has been deactivated.",
          code,
        },
      });
    }

    // Determine if suspicious
    const isSuspicious = verificationCode.scanCount >= SUSPICIOUS_SCAN_THRESHOLD;
    const result = isSuspicious ? "SUSPICIOUS" : "VERIFIED";

    // Update scan count
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { scanCount: { increment: 1 } },
    });

    // Log the scan
    const scanLog = await prisma.scanLog.create({
      data: {
        verificationCodeId: verificationCode.id,
        ipAddress: req.ip || req.socket.remoteAddress || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        result: result as any,
        // Location would be determined by IP geolocation service in production
      },
    });

    // If suspicious, create notification for the company
    if (isSuspicious) {
      await prisma.notification.create({
        data: {
          companyId: verificationCode.product.companyId,
          title: "⚠️ Suspicious Scan Detected",
          message: `Verification code ${code} for "${verificationCode.product.name}" has been scanned ${verificationCode.scanCount + 1} times. This might indicate counterfeit activity.`,
          type: "suspicious_scan",
        },
      });
    }

    const responseData: any = {
      result,
      message:
        result === "VERIFIED"
          ? "✅ This product has been verified as authentic!"
          : "⚠️ This product has been scanned multiple times. It might be counterfeit. Please verify with the manufacturer.",
      product: {
        name: verificationCode.product.name,
        category: verificationCode.product.category,
        batchNumber: verificationCode.product.batchNumber,
        manufacturingDate: verificationCode.product.manufacturingDate,
        expiryDate: verificationCode.product.expiryDate,
        status: verificationCode.product.status,
        lifecycle: verificationCode.product.lifecycle,
      },
      company: {
        name: verificationCode.product.company.name,
        logo: verificationCode.product.company.logo,
        website: verificationCode.product.company.website,
        location: [verificationCode.product.company.city, verificationCode.product.company.country]
          .filter(Boolean)
          .join(", "),
        isVerifiedCompany: verificationCode.product.company.status === "APPROVED",
      },
      scanInfo: {
        totalScans: verificationCode.scanCount + 1,
        firstRegistered: verificationCode.createdAt,
        verifiedAt: verificationCode.product.verifiedAt,
      },
      code,
    };

    res.json({ status: "success", data: responseData });
  } catch (error) {
    next(error);
  }
};

// POST /api/verify/report — PUBLIC endpoint
export const reportCounterfeit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = counterfeitReportSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { verificationCodeId, reporterEmail, reporterName, description } = parsed.data;

    const report = await prisma.counterfeitReport.create({
      data: {
        verificationCodeId,
        reporterEmail,
        reporterName,
        description,
        evidence: req.body.evidence || [],
      },
    });

    // Notify company if code exists
    if (verificationCodeId) {
      const code = await prisma.verificationCode.findUnique({
        where: { id: verificationCodeId },
        include: { product: { select: { companyId: true, name: true } } },
      });

      if (code) {
        await prisma.notification.create({
          data: {
            companyId: code.product.companyId,
            title: "🚨 Counterfeit Report Filed",
            message: `A counterfeit report has been filed for product "${code.product.name}". Please review the report.`,
            type: "counterfeit_report",
          },
        });
      }
    }

    res.status(201).json({
      status: "success",
      message: "Thank you for your report. We will investigate this matter.",
      data: { reportId: report.id },
    });
  } catch (error) {
    next(error);
  }
};
