import { z } from "zod";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: "Invalid payment method"
  }),
  utrNumber: z.string().optional(),
  paymentScreenshot: z.string().optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .regex(/^\d+$/, "Mobile number must contain digits only")
    .min(10, "Mobile number must be at least 10 digits"),
  locationDetails: z
    .string()
    .trim()
    .min(1, "Location details are required"),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>;

export const orderIdParamSchema = z.object({
  id: z.string().uuid("Invalid order ID"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([PaymentStatus.cancelled], {
    message: "Only cancellation is supported through this endpoint",
  }),
});

export const sellerDecisionSchema = z.object({
  status: z.enum(["accepted", "rejected"], {
    message: "Status must be 'accepted' or 'rejected'",
  }),
  rejectionReason: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusSchema>;
export type SellerDecisionBody = z.infer<typeof sellerDecisionSchema>;
