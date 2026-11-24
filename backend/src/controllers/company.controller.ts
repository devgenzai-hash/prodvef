import { Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

// GET /api/company/profile
export const getCompanyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, name: true, email: true, phone: true, taxId: true,
        description: true, logo: true, website: true, address: true,
        city: true, country: true, status: true, createdAt: true,
      },
    });

    if (!company) throw new AppError("Company not found", 404);

    res.json({ status: "success", data: company });
  } catch (error) {
    next(error);
  }
};

// PUT /api/company/profile
export const updateCompanyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, description, website, address, city, country, logo } = req.body;

    const company = await prisma.company.update({
      where: { id: req.user!.id },
      data: { name, phone, description, website, address, city, country, logo },
      select: {
        id: true, name: true, email: true, phone: true,
        description: true, logo: true, website: true,
        address: true, city: true, country: true,
      },
    });

    res.json({ status: "success", data: company });
  } catch (error) {
    next(error);
  }
};

// GET /api/company/dashboard
export const getCompanyDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.id;

    const [totalProducts, verifiedProducts, pendingProducts, totalScans, recentScans] = await Promise.all([
      prisma.product.count({ where: { companyId } }),
      prisma.product.count({ where: { companyId, status: "VERIFIED" } }),
      prisma.product.count({ where: { companyId, status: "PENDING" } }),
      prisma.scanLog.count({
        where: { verificationCode: { product: { companyId } } },
      }),
      prisma.scanLog.findMany({
        where: { verificationCode: { product: { companyId } } },
        orderBy: { scannedAt: "desc" },
        take: 10,
        include: {
          verificationCode: {
            include: { product: { select: { name: true } } },
          },
        },
      }),
    ]);

    // Scans per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const scansByDay = await prisma.scanLog.groupBy({
      by: ["scannedAt"],
      where: {
        verificationCode: { product: { companyId } },
        scannedAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    });

    res.json({
      status: "success",
      data: {
        stats: {
          totalProducts,
          verifiedProducts,
          pendingProducts,
          totalScans,
        },
        recentScans: recentScans.map((scan) => ({
          id: scan.id,
          productName: scan.verificationCode.product.name,
          code: scan.verificationCode.uniqueCode,
          result: scan.result,
          scannedAt: scan.scannedAt,
          city: scan.city,
          country: scan.country,
        })),
        scansByDay: scansByDay.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/company/notifications
export const getCompanyNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { companyId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ status: "success", data: notifications });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/company/notifications/:id/read
export const markNotificationRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, companyId: req.user!.id },
      data: { read: true },
    });

    res.json({ status: "success", message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};
