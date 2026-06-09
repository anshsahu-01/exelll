import { z } from "zod";

export const getSellersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const sellerIdParamSchema = z.object({
  id: z.string().uuid("Invalid seller ID"),
});

export type GetSellersQuery = z.infer<typeof getSellersQuerySchema>;
