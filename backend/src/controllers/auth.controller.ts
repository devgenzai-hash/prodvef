import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { companyRegisterSchema, loginSchema } from "../utils/validators";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
}

// POST /api/auth/company/register
export const companyRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = companyRegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password, name, phone, taxId, description, address, city, country } = parsed.data;

    // Check if company already exists
    const existing = await prisma.company.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("A company with this email already exists.", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        taxId,
        description,
        address,
        city,
        country,
        status: "PENDING",
      },
    });

    // Generate token
    const token = generateToken({ id: company.id, email: company.email, role: "company" });

    res.status(201).json({
      status: "success",
      message: "Company registered successfully. Awaiting admin approval.",
      data: {
        token,
        company: {
          id: company.id,
          name: company.name,
          email: company.email,
          status: company.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/company/login
export const companyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    // Find company
    const company = await prisma.company.findUnique({ where: { email } });
    if (!company) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Check if suspended
    if (company.status === "SUSPENDED") {
      throw new AppError("Your account has been suspended. Contact support.", 403);
    }

    // Generate token
    const token = generateToken({ id: company.id, email: company.email, role: "company" });

    res.json({
      status: "success",
      data: {
        token,
        company: {
          id: company.id,
          name: company.name,
          email: company.email,
          status: company.status,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/admin/login
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.errors[0].message, 400);
    }

    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: "admin" });

    res.json({
      status: "success",
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError("Not authenticated", 401);

    if (req.user.role === "company") {
      const company = await prisma.company.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, status: true, logo: true, phone: true },
      });
      return res.json({ status: "success", data: { ...company, role: "company" } });
    }

    if (req.user.role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true },
      });
      return res.json({ status: "success", data: { ...admin, role: "admin" } });
    }

    throw new AppError("Invalid role", 400);
  } catch (error) {
    next(error);
  }
};
