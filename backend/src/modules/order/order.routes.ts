import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as orderController from "./order.controller";
import {
  createOrderSchema,
  orderIdParamSchema,
  sellerDecisionSchema,
  updateOrderStatusSchema,
} from "./order.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  orderController.createOrder
);

router.get("/my-orders", authenticate, orderController.getMyOrders);

router.get("/my-sales", authenticate, orderController.getMySales);

router.get(
  "/:id",
  authenticate,
  validate(orderIdParamSchema, "params"),
  orderController.getOrderById
);

router.patch(
  "/:id/status",
  authenticate,
  validate(orderIdParamSchema, "params"),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

router.patch(
  "/:id/decision",
  authenticate,
  validate(orderIdParamSchema, "params"),
  validate(sellerDecisionSchema),
  orderController.sellerDecision
);

export default router;
