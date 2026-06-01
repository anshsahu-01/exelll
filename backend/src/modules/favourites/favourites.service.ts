import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

const favouriteInclude = {
  product: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          collegeName: true,
          isVerified: true,
        },
      },
      category: {
        select: { id: true, name: true },
      },
    },
  },
} satisfies Prisma.FavouriteInclude;

type FavouriteWithProduct = Prisma.FavouriteGetPayload<{
  include: typeof favouriteInclude;
}>;

function formatFavourite(favourite: FavouriteWithProduct) {
  const { product } = favourite;
  return {
    id: favourite.id,
    productId: favourite.productId,
    createdAt: favourite.createdAt,
    product: {
      ...product,
      price: Number(product.price),
      isSold: product.isSold,
      seller: product.user,
      category: product.category,
    },
  };
}

export async function getMyFavourites(userId: string) {
  const favourites = await prisma.favourite.findMany({
    where: { userId },
    include: favouriteInclude,
    orderBy: { createdAt: "desc" },
  });

  return favourites.map(formatFavourite);
}

export async function addFavourite(userId: string, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const favourite = await prisma.favourite.upsert({
    where: {
      userId_productId: { userId, productId },
    },
    update: {},
    create: { userId, productId },
    include: favouriteInclude,
  });

  return formatFavourite(favourite);
}

export async function removeFavourite(userId: string, productId: string) {
  await prisma.favourite.deleteMany({
    where: { userId, productId },
  });

  return { success: true };
}

export async function toggleFavourite(userId: string, productId: string) {
  const existing = await prisma.favourite.findUnique({
    where: { userId_productId: { userId, productId } },
    include: favouriteInclude,
  });

  if (existing) {
    await prisma.favourite.delete({ where: { id: existing.id } });
    return { favourited: false };
  }

  await addFavourite(userId, productId);
  return { favourited: true };
}

export async function getFavouriteProductIds(userId: string) {
  const favourites = await prisma.favourite.findMany({
    where: { userId },
    select: { productId: true },
  });

  return favourites.map((item) => item.productId);
}
