import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as cartController from "./cart.controller";
import { checkoutSchema, productIdParamSchema, updateCartItemSchema } from "./cart.validation";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post(
  "/add/:productId",
  validate(productIdParamSchema, "params"),
  cartController.addToCart
);
router.put(
  "/update/:productId",
  validate(productIdParamSchema, "params"),
  validate(updateCartItemSchema),
  cartController.updateCartItem
);
router.delete(
  "/remove/:productId",
  validate(productIdParamSchema, "params"),
  cartController.removeCartItem
);
router.post(
  "/checkout",
  validate(checkoutSchema),
  cartController.checkout
);

export default router;
