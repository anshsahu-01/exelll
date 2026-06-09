import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as sellerController from "./seller.controller";
import { getSellersQuerySchema, sellerIdParamSchema } from "./seller.validation";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  validate(getSellersQuerySchema, "query"),
  sellerController.getSellers
);

router.get(
  "/overview",
  sellerController.getOverview
);

router.get(
  "/:id",
  validate(sellerIdParamSchema, "params"),
  sellerController.getSellerById
);

export default router;
