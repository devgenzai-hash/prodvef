import { Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { productSchema } from "../utils/validators";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { generateVerificationCode, generateQRCode, buildVerificationUrl } from "../utils/codeGenerator";

// POST /api/products
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const company = await prisma.company.findUnique({ where: { id: req.user!.id } });
    if (!company || company.status !== "APPROVED") {
      throw new AppError("Your company must be approved before adding products.", 403);
    }

    const { name, sku, category, batchNumber, manufacturingDate, expiryDate, description } = parsed.data;

    const product = await prisma.product.create({
      data: {
        companyId: req.user!.id,
        name,
        sku,
        category,
        batchNumber,
        manufacturingDate: new Date(manufacturingDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
        images: req.body.images || [],
        certificates: req.body.certificates || [],
      },
    });

    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

// GET /api/products
export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, category, search, page = "1", limit = "10" } = req.query;

    const where: any = { companyId: req.user!.id };
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
        { batchNumber: { contains: search as string, mode: "insensitive" } },
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

// GET /api/products/:id
export const getProductById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.user!.id },
      include: {
        verificationCodes: {
          select: { id: true, uniqueCode: true, qrCodeUrl: true, status: true, scanCount: true, createdAt: true },
        },
        _count: { select: { verificationCodes: true } },
      },
    });

    if (!product) throw new AppError("Product not found", 404);

    res.json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.user!.id },
    });

    if (!existing) throw new AppError("Product not found", 404);

    const { name, category, description, lifecycle, images, certificates } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description && { description }),
        ...(lifecycle && { lifecycle }),
        ...(images && { images }),
        ...(certificates && { certificates }),
      },
    });

    res.json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.user!.id },
    });

    if (!existing) throw new AppError("Product not found", 404);

    await prisma.product.delete({ where: { id: req.params.id } });

    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/:id/generate-codes
export const generateProductCodes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { count = 1 } = req.body;

    if (count > 100) throw new AppError("Cannot generate more than 100 codes at once", 400);

    const product = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.user!.id },
      include: { company: { select: { name: true } } },
    });

    if (!product) throw new AppError("Product not found", 404);

    const codes = [];
    for (let i = 0; i < count; i++) {
      const uniqueCode = generateVerificationCode(product.company.name);
      const verificationUrl = buildVerificationUrl(uniqueCode);
      const qrCodeUrl = await generateQRCode(verificationUrl);

      const code = await prisma.verificationCode.create({
        data: {
          productId: product.id,
          uniqueCode,
          qrCodeUrl,
        },
      });

      codes.push(code);
    }

    res.status(201).json({
      status: "success",
      message: `${count} verification code(s) generated`,
      data: codes,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id/codes
export const getProductCodes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.user!.id },
    });

    if (!product) throw new AppError("Product not found", 404);

    const codes = await prisma.verificationCode.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { scanLogs: true } },
      },
    });

    res.json({ status: "success", data: codes });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/analytics
export const getProductAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.id;

    const [productsByStatus, productsByCategory, topScannedProducts, recentScans] = await Promise.all([
      prisma.product.groupBy({
        by: ["status"],
        where: { companyId },
        _count: true,
      }),
      prisma.product.groupBy({
        by: ["category"],
        where: { companyId },
        _count: true,
      }),
      prisma.verificationCode.findMany({
        where: { product: { companyId } },
        orderBy: { scanCount: "desc" },
        take: 10,
        include: { product: { select: { name: true, sku: true } } },
      }),
      prisma.scanLog.findMany({
        where: { verificationCode: { product: { companyId } } },
        orderBy: { scannedAt: "desc" },
        take: 50,
        select: { scannedAt: true, result: true, city: true, country: true },
      }),
    ]);

    res.json({
      status: "success",
      data: {
        productsByStatus,
        productsByCategory,
        topScannedProducts: topScannedProducts.map((code) => ({
          code: code.uniqueCode,
          productName: code.product.name,
          sku: code.product.sku,
          scanCount: code.scanCount,
        })),
        recentScans,
      },
    });
  } catch (error) {
    next(error);
  }
};
