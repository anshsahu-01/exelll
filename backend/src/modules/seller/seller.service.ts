import { ProductStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { getPaginationMeta, PaginationMeta } from "../../utils/pagination";
import { GetSellersQuery } from "./seller.validation";

export async function getSellers(query: GetSellersQuery) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // We use a raw query here because Prisma does not natively support
  // sorting by conditional counts (e.g. sorting by ACTIVE products count only)
  
  const totalResult = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(DISTINCT u."id") as "count"
    FROM "User" u
    INNER JOIN "Product" p ON u."id" = p."userId"
  `;
  
  const total = Number(totalResult[0]?.count || 0);

  const sellers = await prisma.$queryRaw<{
    id: string;
    name: string;
    profileImage: string | null;
    collegeName: string | null;
    createdAt: Date;
    totalUploads: bigint;
    activeListings: bigint;
    soldListings: bigint;
  }[]>`
    SELECT 
      u."id", 
      u."name", 
      u."profileImage", 
      u."collegeName", 
      u."createdAt",
      COUNT(p."id") AS "totalUploads",
      COUNT(CASE WHEN p."status" = 'ACTIVE' THEN 1 END) AS "activeListings",
      COUNT(CASE WHEN p."status" = 'SOLD' THEN 1 END) AS "soldListings"
    FROM "User" u
    INNER JOIN "Product" p ON u."id" = p."userId"
    GROUP BY u."id"
    ORDER BY 
      "activeListings" DESC,
      "soldListings" DESC,
      "totalUploads" DESC,
      u."createdAt" DESC
    LIMIT ${limit} OFFSET ${skip}
  `;

  const formattedSellers = sellers.map(seller => ({
    id: seller.id,
    name: seller.name,
    profileImage: seller.profileImage,
    collegeName: seller.collegeName,
    createdAt: seller.createdAt,
    totalUploads: Number(seller.totalUploads),
    activeListings: Number(seller.activeListings),
    soldListings: Number(seller.soldListings),
  }));

  return {
    sellers: formattedSellers,
    pagination: getPaginationMeta(page, limit, total) satisfies PaginationMeta,
  };
}

export async function getSellerById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      profileImage: true,
      collegeName: true,
      createdAt: true,
      _count: {
        select: {
          products: true,
        }
      }
    }
  });

  if (!user) {
    throw new AppError("Seller not found", 404);
  }

  // Use raw query just for conditional counts to keep it fast, 
  // or fetch arrays directly. Since we need arrays anyway, we can just query products.
  const activeProducts = await prisma.product.findMany({
    where: { userId: id, status: ProductStatus.ACTIVE },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      images: true,
      status: true,
      isSold: true,
      createdAt: true,
      condition: true,
      category: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  const soldProducts = await prisma.product.findMany({
    where: { userId: id, status: ProductStatus.SOLD },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      images: true,
      status: true,
      isSold: true,
      createdAt: true,
      condition: true,
      category: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  });

  return {
    id: user.id,
    name: user.name,
    profileImage: user.profileImage,
    collegeName: user.collegeName,
    createdAt: user.createdAt,
    totalUploads: user._count.products,
    activeListings: activeProducts.length,
    soldListings: soldProducts.length,
    activeProducts: activeProducts.map(p => ({ ...p, price: Number(p.price) })),
    soldProducts: soldProducts.map(p => ({ ...p, price: Number(p.price) })),
  };
}

export async function getMarketplaceOverview() {
  const [totalListings, totalSellersResult, soldListings] = await Promise.all([
    prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
    prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(DISTINCT "userId") as "count" FROM "Product"`,
    prisma.product.count({ where: { status: ProductStatus.SOLD } }),
  ]);

  return {
    totalActiveListings: totalListings,
    totalSellers: Number(totalSellersResult[0]?.count || 0),
    totalSoldItems: soldListings,
  };
}
