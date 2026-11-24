import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "company" | "admin";
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Please provide a valid token.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: "company" | "admin";
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token.", 401));
    }
  }
};

export const authorizeCompany = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "company") {
    return next(new AppError("Access denied. Company account required.", 403));
  }
  next();
};

export const authorizeAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }
  next();
};
