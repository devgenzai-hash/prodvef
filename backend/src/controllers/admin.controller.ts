import { Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

// GET /api/admin/dashboard
export const getAdminDashboard = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [
      totalCompanies,
      pendingCompanies,
      approvedCompanies,
      totalProducts,
      verifiedProducts,
      pendingProducts,
      totalScans,
      totalReports,
      pendingReports,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { status: "PENDING" } }),
      prisma.company.count({ where: { status: "APPROVED" } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: "VERIFIED" } }),
      prisma.product.count({ where: { status: "PENDING" } }),
      prisma.scanLog.count(),
      prisma.counterfeitReport.count(),
      prisma.counterfeitReport.count({ where: { status: "PENDING" } }),
    ]);

    // Recent activity
    const recentCompanies = await prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    });

    const recentReports = await prisma.counterfeitReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, reporterEmail: true, description: true, status: true, createdAt: true },
    });

    res.json({
      status: "success",
      data: {
        stats: {
          totalCompanies,
          pendingCompanies,
          approvedCompanies,
          totalProducts,
          verifiedProducts,
          pendingProducts,
          totalScans,
          totalReports,
          pendingReports,
        },
        recentCompanies,
        recentReports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/companies
export const getCompanies = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = "1", limit = "10" } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
        select: {
          id: true, name: true, email: true, phone: true, taxId: true,
          status: true, city: true, country: true, createdAt: true,
          _count: { select: { products: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      status: "success",
      data: companies,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/companies/:id/approve
export const approveCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.update({
      where: { id: req.params.id },
      data: { status: "APPROVED" },
    });

    await prisma.notification.create({
      data: {
        companyId: company.id,
        title: "🎉 Company Approved!",
        message: "Your company has been verified and approved. You can now start adding products.",
        type: "company_approved",
      },
    });

    res.json({ status: "success", message: "Company approved successfully" });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/companies/:id/reject
export const rejectCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;

    const company = await prisma.company.update({
      where: { id: req.params.id },
      data: { status: "REJECTED", rejectionNote: reason },
    });

    await prisma.notification.create({
      data: {
        companyId: company.id,
        title: "❌ Company Registration Rejected",
        message: `Your company registration has been rejected. Reason: ${reason || "Does not meet verification criteria."}`,
        type: "company_rejected",
      },
    });

    res.json({ status: "success", message: "Company rejected" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/products
export const getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search, page = "1", limit = "10" } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { name: true, email: true } },
          _count: { select: { verificationCodes: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      status: "success",
      data: products,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/products/:id/verify
export const verifyProductAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status: "VERIFIED", verifiedAt: new Date() },
    });

    await prisma.notification.create({
      data: {
        companyId: product.companyId,
        title: "✅ Product Verified!",
        message: `Your product "${product.name}" (SKU: ${product.sku}) has been verified by TrustVerify.`,
        type: "product_verified",
      },
    });

    res.json({ status: "success", message: "Product verified successfully" });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/products/:id/reject
export const rejectProductAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status: "REJECTED", rejectionNote: reason },
    });

    await prisma.notification.create({
      data: {
        companyId: product.companyId,
        title: "❌ Product Rejected",
        message: `Your product "${product.name}" has been rejected. Reason: ${reason || "Does not meet verification criteria."}`,
        type: "product_rejected",
      },
    });

    res.json({ status: "success", message: "Product rejected" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports
export const getCounterfeitReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [reports, total] = await Promise.all([
      prisma.counterfeitReport.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
        include: {
          verificationCode: {
            include: { product: { select: { name: true, company: { select: { name: true } } } } },
          },
        },
      }),
      prisma.counterfeitReport.count({ where }),
    ]);

    res.json({
      status: "success",
      data: reports,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/reports/:id/status
export const updateReportStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, adminNotes } = req.body;

    if (!["INVESTIGATING", "RESOLVED", "DISMISSED"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    await prisma.counterfeitReport.update({
      where: { id: req.params.id },
      data: { status, adminNotes },
    });

    res.json({ status: "success", message: `Report marked as ${status}` });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/fraud-alerts
export const getFraudAlerts = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get codes with high scan counts (potential fraud)
    const suspiciousCodes = await prisma.verificationCode.findMany({
      where: { scanCount: { gte: 5 } },
      orderBy: { scanCount: "desc" },
      take: 20,
      include: {
        product: {
          select: { name: true, company: { select: { name: true } } },
        },
        scanLogs: {
          orderBy: { scannedAt: "desc" },
          take: 5,
          select: { scannedAt: true, city: true, country: true, ipAddress: true },
        },
      },
    });

    res.json({
      status: "success",
      data: suspiciousCodes.map((code) => ({
        id: code.id,
        uniqueCode: code.uniqueCode,
        scanCount: code.scanCount,
        productName: code.product.name,
        companyName: code.product.company.name,
        recentScans: code.scanLogs,
      })),
    });
  } catch (error) {
    next(error);
  }
};
