import { Router } from "express";
import { verifyProduct, reportCounterfeit } from "../controllers/verify.controller";

const router = Router();

// Public routes — no authentication needed
router.get("/:code", verifyProduct);
router.post("/report", reportCounterfeit);

export default router;
