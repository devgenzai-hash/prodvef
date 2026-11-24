import { Router } from "express";
import {
  getAdminDashboard,
  getCompanies,
  approveCompany,
  rejectCompany,
  getAllProducts,
  verifyProductAdmin,
  rejectProductAdmin,
  getCounterfeitReports,
  updateReportStatus,
  getFraudAlerts,
} from "../controllers/admin.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/companies", getCompanies);
router.patch("/companies/:id/approve", approveCompany);
router.patch("/companies/:id/reject", rejectCompany);
router.get("/products", getAllProducts);
router.patch("/products/:id/verify", verifyProductAdmin);
router.patch("/products/:id/reject", rejectProductAdmin);
router.get("/reports", getCounterfeitReports);
router.patch("/reports/:id/status", updateReportStatus);
router.get("/fraud-alerts", getFraudAlerts);

export default router;
