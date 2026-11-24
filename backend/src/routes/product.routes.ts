import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  generateProductCodes,
  getProductCodes,
  getProductAnalytics,
} from "../controllers/product.controller";
import { authenticate, authorizeCompany } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorizeCompany);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/analytics", getProductAnalytics);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/generate-codes", generateProductCodes);
router.get("/:id/codes", getProductCodes);

export default router;
