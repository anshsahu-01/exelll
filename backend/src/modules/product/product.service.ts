import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { getPaginationMeta, PaginationMeta } from "../../utils/pagination";
import { buildProductOrderBy, buildProductWhere } from "./product.query";
import {
  CreateProductInput,
  GetProductsQuery,
  UpdateProductInput,
  UpdateProductStatusBody,
} from "./product.validation";

const sellerSelect = {
  id: true,
  name: true,
  profileImage: true,
  collegeName: true,
  isVerified: true,
} satisfies Prisma.UserSelect;

const categorySelect = {
  id: true,
  name: true,
} satisfies Prisma.CategorySelect;

const productInclude = {
  user: { select: sellerSelect },
  category: { select: categorySelect },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}> & {
  contactNumber?: string | null;
};

function formatProduct(product: ProductWithRelations) {
  const { user, ...rest } = product;
  const isSold = rest.status === ProductStatus.SOLD;
  return {
    ...rest,
    price: Number(rest.price),
    isSold,
    seller: user,
  };
}

function formatProductForViewer(product: ProductWithRelations, viewerId?: string) {
  const formatted = formatProduct(product);
  if (!viewerId || viewerId !== product.userId) {
    const { contactNumber, ...publicProduct } = formatted;
    return publicProduct;
  }
  return formatted;
}

async function getFavouriteProductIds(userId?: string) {
  if (!userId) return new Set<string>();
  const favourites = await prisma.favourite.findMany({
    where: { userId },
    select: { productId: true },
  });
  return new Set(favourites.map((item) => item.productId));
}

function annotateFavourite<T extends { id: string }>(items: T[], favouriteIds: Set<string>) {
  return items.map((item) => ({
    ...item,
    isFavourite: favouriteIds.has(item.id),
  }));
}

async function ensureCategoryExists(categoryId: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }
}

export async function createProduct(userId: string, input: CreateProductInput) {
  await ensureCategoryExists(input.categoryId);

  const product = await prisma.product.create({
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      condition: input.condition,
      contactNumber: input.contactNumber ?? null,
      images: input.images,
      categoryId: input.categoryId,
      userId,
      status: ProductStatus.ACTIVE,
      isSold: false,
    } as Prisma.ProductUncheckedCreateInput & { contactNumber?: string | null },
    include: productInclude,
  });

  return formatProduct(product);
}

export async function getAllProducts(query: GetProductsQuery, userId?: string) {
  const { page, limit, sort } = query;
  const skip = (page - 1) * limit;
  const where = buildProductWhere(query);
  const orderBy = buildProductOrderBy(sort);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  const favouriteIds = await getFavouriteProductIds(userId);

  return {
    products: annotateFavourite(products.map((product) => formatProductForViewer(product, userId)), favouriteIds),
    pagination: getPaginationMeta(page, limit, total) satisfies PaginationMeta,
  };
}

export async function getProductById(id: string, userId?: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const favouriteIds = await getFavouriteProductIds(userId);
  return {
    ...formatProductForViewer(product, userId),
    isFavourite: favouriteIds.has(id),
  };
}

export async function getMyProducts(userId: string) {
  const products = await prisma.product.findMany({
    where: {
      userId,
      status: { in: [ProductStatus.ACTIVE, ProductStatus.SOLD] },
    },
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });

  const formattedForViewer = products.map((product) => formatProductForViewer(product, userId));
  const favouriteIds = await getFavouriteProductIds(userId);

  return {
    active: annotateFavourite(formattedForViewer.filter((p) => p.status === ProductStatus.ACTIVE), favouriteIds),
    sold: annotateFavourite(formattedForViewer.filter((p) => p.status === ProductStatus.SOLD), favouriteIds),
  };
}

export async function updateProduct(
  id: string,
  userId: string,
  input: UpdateProductInput
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.userId !== userId) {
    throw new AppError("You are not allowed to update this product", 403);
  }

  await ensureCategoryExists(input.categoryId);

  if (!input.images.length) {
    throw new AppError("At least one product image is required", 400);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      title: input.title,
      description: input.description,
      price: input.price,
      condition: input.condition,
      contactNumber: input.contactNumber ?? null,
      categoryId: input.categoryId,
      images: input.images,
    } as Prisma.ProductUncheckedUpdateInput & { contactNumber?: string | null },
    include: productInclude,
  });

  const favouriteIds = await getFavouriteProductIds(userId);
  return {
    ...formatProductForViewer(updated, userId),
    isFavourite: favouriteIds.has(id),
  };
}

export async function updateProductStatus(
  id: string,
  userId: string,
  input: UpdateProductStatusBody
) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.userId !== userId) {
    throw new AppError("You are not allowed to update this product", 403);
  }

  const isSold = input.status === ProductStatus.SOLD;

  const updated = await prisma.product.update({
    where: { id },
    data: {
      status: input.status,
      isSold,
    },
    include: productInclude,
  });

  return formatProduct(updated);
}

export async function deleteProduct(id: string, userId: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.userId !== userId) {
    throw new AppError("You are not allowed to delete this product", 403);
  }

  await prisma.product.delete({ where: { id } });
}
