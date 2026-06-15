import { OrderStatus, PaymentStatus, Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { CreateOrderBody, UpdateOrderStatusBody } from "./order.validation";
import { uploadImageBuffer } from "../../utils/upload";
import { buildAcceptedOrderEmail, buildNewOrderEmail, buildRejectedOrderEmail } from "./order.email";
import { sendTransactionalEmail } from "../../utils/email";

const userSelect = {
  id: true,
  name: true,
  profileImage: true,
  collegeName: true,
  isVerified: true,
} satisfies Prisma.UserSelect;

const productSelect = {
  id: true,
  title: true,
  images: true,
  price: true,
  contactNumber: true,
} as Prisma.ProductSelect & { contactNumber: true };

const orderInclude = {
  product: { select: productSelect },
  buyer: { select: userSelect },
  seller: { select: userSelect },
} satisfies Prisma.OrderInclude;

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

function formatOrder(order: OrderWithRelations) {
  const isAccepted = order.orderStatus === OrderStatus.accepted;
  const product = order.product as typeof order.product & { contactNumber?: string | null };
  return {
    ...order,
    amount: Number(order.amount),
    mobileNumber: isAccepted ? order.mobileNumber : null,
    product: {
      ...product,
      contactNumber: isAccepted ? product.contactNumber : null,
    },
  };
}

function toOrderUrl(orderId: string) {
  return `${process.env.APP_WEB_URL || "https://exelll.me"}/profile/orders/${orderId}`;
}

async function queueEmail(task: () => Promise<unknown>, label: string) {
  setImmediate(() => {
    void task().catch((error) => {
      console.error(`[email] ${label} failed`, error);
    });
  });
}

export async function createOrder(buyerId: string, input: CreateOrderBody) {
  console.log("SERVICE_STAGE", {
    utrNumber: input.utrNumber ?? null,
    paymentScreenshot: input.paymentScreenshot ?? null,
  });

  let persistedPaymentScreenshot: string | null = input.paymentScreenshot ?? null;
  if (persistedPaymentScreenshot?.startsWith("data:image/")) {
    const base64 = persistedPaymentScreenshot.split(",")[1];
    if (base64) {
      const buffer = Buffer.from(base64, "base64");
      persistedPaymentScreenshot = await uploadImageBuffer(buffer, "becho/orders");
    }
  }

  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true, userId: true, price: true, status: true, isSold: true },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.status === ProductStatus.SOLD || product.isSold) {
    throw new AppError("Product is already sold", 400);
  }

  if (product.userId === buyerId) {
    throw new AppError("You cannot buy your own product", 400);
  }

  const existingOrder = await prisma.order.findFirst({
    where: {
      productId: input.productId,
      buyerId,
      paymentStatus: PaymentStatus.payment_pending,
    },
  });

  if (existingOrder) {
    throw new AppError("You already have an active order for this product", 400);
  }

  const createData = {
    productId: input.productId,
    buyerId,
    sellerId: product.userId,
    amount: product.price,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus ?? PaymentStatus.payment_pending,
    utrNumber: input.utrNumber ?? null,
    paymentScreenshot: persistedPaymentScreenshot,
    orderStatus: OrderStatus.pending,
    mobileNumber: input.mobileNumber,
    locationDetails: input.locationDetails,
  } satisfies Prisma.OrderUncheckedCreateInput;
  console.log("PRISMA_STAGE", {
    utrNumber: createData.utrNumber ?? null,
    paymentScreenshot: createData.paymentScreenshot ?? null,
  });

  const order = await prisma.order.create({
    data: createData,
    include: orderInclude,
  });
  console.log("DB SAVED ORDER", {
    id: order.id,
    paymentScreenshot: order.paymentScreenshot,
    mobileNumber: order.mobileNumber,
    locationDetails: order.locationDetails,
    utrNumber: order.utrNumber,
    paymentStatus: order.paymentStatus,
  });

  void queueEmail(async () => {
    const seller = await prisma.user.findUnique({
      where: { id: order.sellerId },
      select: { email: true },
    });
    if (!seller?.email) return;
    await sendTransactionalEmail({
      to: seller.email,
      subject: "New Order Request Received",
      html: buildNewOrderEmail({
        productName: order.product.title,
        buyerName: order.buyer.name,
        buyerCollege: order.buyer.collegeName,
        orderDate: order.createdAt.toLocaleString(),
        orderUrl: toOrderUrl(order.id),
      }),
    });
  }, "new-order");

  return formatOrder(order);
}

export async function getMyOrders(buyerId: string) {
  const orders = await prisma.order.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });

  return orders.map(formatOrder);
}

export async function getMySales(sellerId: string) {
  const orders = await prisma.order.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });

  return orders.map(formatOrder);
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.buyerId !== userId && order.sellerId !== userId) {
    throw new AppError("You are not authorized to view this order", 403);
  }

  return formatOrder(order);
}

export async function sellerDecision(
  orderId: string,
  actorId: string,
  input: { status: "accepted" | "rejected"; rejectionReason?: string }
) {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        buyerId: true,
        sellerId: true,
        productId: true,
        paymentStatus: true,
        orderStatus: true,
      },
    });

    if (!order) throw new AppError("Order not found", 404);
    if (order.sellerId !== actorId) throw new AppError("Only the seller can update this order", 403);

    if (order.orderStatus === OrderStatus.accepted || order.orderStatus === OrderStatus.rejected) {
      throw new AppError("Final order decisions cannot be changed", 400);
    }

    if (order.orderStatus !== OrderStatus.pending) {
      throw new AppError("Only pending orders can be decided", 400);
    }

    if (input.status === "accepted") {
      const accepted = await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: PaymentStatus.confirmed, orderStatus: OrderStatus.accepted },
        include: orderInclude,
      });

      const acceptedPayload = formatOrder(accepted);
      void queueEmail(async () => {
      const buyer = await prisma.user.findUnique({
        where: { id: acceptedPayload.buyerId },
        select: { email: true },
      });
      if (!buyer?.email) return;
      await sendTransactionalEmail({
        to: buyer.email,
        subject: "Your Order Has Been Accepted",
          html: buildAcceptedOrderEmail({
            productName: acceptedPayload.product.title,
            sellerName: acceptedPayload.seller.name,
            orderUrl: toOrderUrl(acceptedPayload.id),
          }),
        });
      }, "order-accepted");

      await tx.product.update({
        where: { id: order.productId },
        data: { status: ProductStatus.SOLD, isSold: true },
      });

      await tx.order.updateMany({
        where: {
          productId: order.productId,
          id: { not: orderId },
          orderStatus: OrderStatus.pending,
        },
        data: { paymentStatus: PaymentStatus.cancelled, orderStatus: OrderStatus.cancelled },
      });

      return accepted;
    }

    const rejected = await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.cancelled,
        orderStatus: OrderStatus.rejected,
        rejectionReason: input.rejectionReason ?? null,
      },
      include: orderInclude,
    });

    const rejectedPayload = formatOrder(rejected);
    void queueEmail(async () => {
    const buyer = await prisma.user.findUnique({
      where: { id: rejectedPayload.buyerId },
      select: { email: true },
    });
    if (!buyer?.email) return;
    await sendTransactionalEmail({
      to: buyer.email,
      subject: "Order Request Update",
        html: buildRejectedOrderEmail({
          productName: rejectedPayload.product.title,
          sellerName: rejectedPayload.seller.name,
          rejectionReason: rejectedPayload.rejectionReason,
          orderUrl: toOrderUrl(rejectedPayload.id),
        }),
      });
    }, "order-rejected");

    return rejected;
  });

  return formatOrder(updatedOrder);
}

export async function updateOrderStatus(
  orderId: string,
  actorId: string,
  input: UpdateOrderStatusBody
) {
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        buyerId: true,
        sellerId: true,
        productId: true,
        paymentStatus: true,
        orderStatus: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const isSeller = order.sellerId === actorId;
    const isBuyer = order.buyerId === actorId;

    if (!isSeller && !isBuyer) {
      throw new AppError("You are not authorized to update this order", 403);
    }

    if (input.status !== PaymentStatus.cancelled) {
      throw new AppError("Only cancellations are supported through this endpoint", 400);
    }

    if (
      order.orderStatus !== OrderStatus.pending &&
      order.orderStatus !== OrderStatus.accepted &&
      order.orderStatus !== OrderStatus.processing
    ) {
      throw new AppError("Completed, shipped, or cancelled orders cannot be cancelled", 400);
    }

    if (!isSeller && !isBuyer) {
      throw new AppError("You are not authorized to cancel this order", 403);
    }

    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.cancelled,
        orderStatus: OrderStatus.cancelled,
      },
      include: orderInclude,
    });

    if (order.orderStatus === OrderStatus.processing || order.orderStatus === OrderStatus.accepted) {
      await tx.product.update({
        where: { id: order.productId },
        data: { status: ProductStatus.ACTIVE, isSold: false },
      });
    }

    return cancelledOrder;
  });

  return formatOrder(updatedOrder);
}
