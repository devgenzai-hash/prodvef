import { z } from "zod";

export const companyRegisterSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  taxId: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  manufacturingDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
});

export const verifyCodeSchema = z.object({
  code: z.string().min(5, "Verification code must be at least 5 characters"),
});

export const counterfeitReportSchema = z.object({
  verificationCodeId: z.string().optional(),
  reporterEmail: z.string().email("Valid email is required"),
  reporterName: z.string().optional(),
  description: z.string().min(10, "Please provide a detailed description (min 10 chars)"),
});
