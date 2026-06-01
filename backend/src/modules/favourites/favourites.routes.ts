import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import * as favouritesController from "./favourites.controller";
import { productIdParamSchema } from "./favourites.validation";

const router = Router();

router.use(authenticate);

router.get("/", favouritesController.getMyFavourites);
router.get("/me", favouritesController.getMyFavourites);
router.get("/ids", favouritesController.getFavouriteProductIds);
router.get("/me/ids", favouritesController.getFavouriteProductIds);
router.post("/toggle", favouritesController.toggleFavourite);
router.post(
  "/:productId",
  validate(productIdParamSchema, "params"),
  favouritesController.addFavourite
);
router.delete(
  "/:productId",
  validate(productIdParamSchema, "params"),
  favouritesController.removeFavourite
);
router.patch(
  "/:productId/toggle",
  validate(productIdParamSchema, "params"),
  favouritesController.toggleFavourite
);

export default router;
