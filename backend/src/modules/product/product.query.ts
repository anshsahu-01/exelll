import { Prisma, ProductStatus } from "@prisma/client";
import { GetProductsQuery } from "./product.validation";

export function buildProductWhere(
  query: GetProductsQuery
): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };

  if (query.search) {
  where.OR = [
    {
      title: {
        contains: query.search,
        mode: "insensitive",
      },
    },
    {
      description: {
        contains: query.search,
        mode: "insensitive",
      },
    },
    {
      category: {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    },
    {
      condition: {
        contains: query.search,
        mode: "insensitive",
      },
    },
  ];
}

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.condition) {
    where.condition = {
      equals: query.condition,
      mode: "insensitive",
    };
  }

  return where;
}

export function buildProductOrderBy(
  sort: GetProductsQuery["sort"]
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "latest":
    default:
      return { createdAt: "desc" };
  }
}
