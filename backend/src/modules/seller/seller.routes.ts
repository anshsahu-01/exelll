import { Router } from "express";
import { authenticateOptional } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as sellerController from "./seller.controller";
import { getSellersQuerySchema, sellerIdParamSchema } from "./seller.validation";

const router = Router();

// Public read-only seller endpoints (guests can browse)
router.get(
  "/",
  authenticateOptional,
  validate(getSellersQuerySchema, "query"),
  sellerController.getSellers
);

router.get(
  "/overview",
  authenticateOptional,
  sellerController.getOverview
);

router.get(
  "/:id",
  authenticateOptional,
  validate(sellerIdParamSchema, "params"),
  sellerController.getSellerById
);

export default router;
