import { PaymentMethod, PaymentStatus, Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CheckoutInput, UpdateCartItemInput } from "./cart.validation";
import { createOrder } from "../order/order.service";

const cartItemInclude = {
  product: {
    include: {
      user: { select: { id: true, name: true, profileImage: true, collegeName: true, isVerified: true } },
      category: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.CartItemInclude;

type CartItemWithProduct = Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }>;

function formatCartItem(item: CartItemWithProduct) {
  return {
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      seller: item.product.user,
      isFavourite: false,
    },
  };
}

export async function getCart(userId: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[cart] prisma accessors", Object.keys(prisma).filter((key) => !key.startsWith("$")));
  }
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: cartItemInclude,
    orderBy: { createdAt: "desc" },
  });

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return {
    items: items.map(formatCartItem),
    total,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export async function addToCart(userId: string, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, userId: true, status: true, isSold: true },
  });

  if (!product) throw new AppError("Product not found", 404);
  if (product.userId === userId) throw new AppError("You cannot add your own product to cart", 400);
  if (product.status === ProductStatus.SOLD || product.isSold) throw new AppError("Product is already sold", 400);

  const cartItem = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: 1 } },
    create: { userId, productId, quantity: 1 },
    include: cartItemInclude,
  });

  return formatCartItem(cartItem);
}

export async function updateCartItem(userId: string, productId: string, input: UpdateCartItemInput) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!cartItem) throw new AppError("Cart item not found", 404);

  if (input.quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItem.id } });
    return null;
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity: input.quantity },
    include: cartItemInclude,
  });

  return formatCartItem(updated);
}

export async function removeCartItem(userId: string, productId: string) {
  await prisma.cartItem.deleteMany({
    where: { userId, productId },
  });
  return { success: true };
}

export async function clearCart(userId: string) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}

export async function checkout(userId: string, input: CheckoutInput) {
  const cart = await prisma.cartItem.findMany({
    where: { userId },
    include: cartItemInclude,
  });

  if (!cart.length) throw new AppError("Cart is empty", 400);

  const orders = [];
  for (const item of cart) {
    const created = await createOrder(userId, {
      productId: item.productId,
      paymentMethod: input.paymentMethod as PaymentMethod,
      paymentStatus: PaymentStatus.payment_pending,
      mobileNumber: input.mobileNumber,
      locationDetails: input.locationDetails,
    });
    orders.push(created);
  }

  await clearCart(userId);
  return orders;
}
