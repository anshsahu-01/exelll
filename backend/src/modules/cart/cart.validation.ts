import { z } from "zod";

export const productIdParamSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  mobileNumber: z.string().trim().min(1),
  locationDetails: z.string().trim().min(1),
  paymentMethod: z.enum(["COD", "UPI"]),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
