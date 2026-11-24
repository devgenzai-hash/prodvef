import { Router } from "express";
import { companyRegister, companyLogin, adminLogin, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Company auth
router.post("/company/register", companyRegister);
router.post("/company/login", companyLogin);

// Admin auth
router.post("/admin/login", adminLogin);

// Get current user
router.get("/me", authenticate, getMe);

export default router;
