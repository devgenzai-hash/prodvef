import { Router } from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyDashboard,
  getCompanyNotifications,
  markNotificationRead,
} from "../controllers/company.controller";
import { authenticate, authorizeCompany } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorizeCompany);

router.get("/profile", getCompanyProfile);
router.put("/profile", updateCompanyProfile);
router.get("/dashboard", getCompanyDashboard);
router.get("/notifications", getCompanyNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

export default router;
