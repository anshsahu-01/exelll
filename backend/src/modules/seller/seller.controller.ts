import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getValidated } from "../../middleware/validate";
import * as sellerService from "./seller.service";
import { GetSellersQuery } from "./seller.validation";

export const getSellers = asyncHandler(async (req: Request, res: Response) => {
  const result = await sellerService.getSellers(
    getValidated<GetSellersQuery>(req, "query")
  );
  
  res.json({
    success: true,
    data: result.sellers,
    pagination: result.pagination,
  });
});

export const getSellerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = getValidated<{ id: string }>(req, "params");
  const seller = await sellerService.getSellerById(id);
  res.json({ success: true, data: seller });
});

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const overview = await sellerService.getMarketplaceOverview();
  res.json({ success: true, data: overview });
});
