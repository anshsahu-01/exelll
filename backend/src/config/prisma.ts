import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  if (!("conversation" in client) || !("message" in client)) {
    throw new Error(
      "Prisma client is missing Conversation/Message models. Run: npx prisma generate && npx prisma migrate deploy"
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[prisma] client models", Object.keys(client).filter((key) => !key.startsWith("$")));
  }

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
