import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getValidated } from "../../middleware/validate";
import * as cartService from "./cart.service";
import { CheckoutInput, UpdateCartItemInput } from "./cart.validation";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  res.json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<{ productId: string }>(req, "params");
  const item = await cartService.addToCart(req.user!.userId, productId);
  res.status(201).json({ success: true, data: item });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<{ productId: string }>(req, "params");
  const input = getValidated<UpdateCartItemInput>(req, "body");
  const item = await cartService.updateCartItem(req.user!.userId, productId, input);
  res.json({ success: true, data: item });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = getValidated<{ productId: string }>(req, "params");
  await cartService.removeCartItem(req.user!.userId, productId);
  res.json({ success: true });
});

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const input = getValidated<CheckoutInput>(req, "body");
  const orders = await cartService.checkout(req.user!.userId, input);
  res.status(201).json({ success: true, data: orders });
});
