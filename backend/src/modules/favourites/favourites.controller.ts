import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getValidated } from "../../middleware/validate";
import * as favouritesService from "./favourites.service";
import { ProductIdParam } from "./favourites.validation";

export const getMyFavourites = asyncHandler(async (req: Request, res: Response) => {
  const favourites = await favouritesService.getMyFavourites(req.user!.userId);
  res.json({ success: true, data: favourites });
});

export const getFavouriteProductIds = asyncHandler(async (req: Request, res: Response) => {
  const favouriteIds = await favouritesService.getFavouriteProductIds(req.user!.userId);
  res.json({ success: true, data: favouriteIds });
});

export const addFavourite = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<ProductIdParam>(req, "params");
  const favourite = await favouritesService.addFavourite(req.user!.userId, productId);
  res.status(201).json({ success: true, data: favourite });
});

export const removeFavourite = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<ProductIdParam>(req, "params");
  await favouritesService.removeFavourite(req.user!.userId, productId);
  res.json({ success: true });
});

export const toggleFavourite = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<ProductIdParam>(req, "params");
  const result = await favouritesService.toggleFavourite(req.user!.userId, productId);
  res.json({ success: true, data: result });
});
