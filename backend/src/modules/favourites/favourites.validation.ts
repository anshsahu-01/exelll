import { z } from "zod";

export const productIdParamSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

export type ProductIdParam = z.infer<typeof productIdParamSchema>;
