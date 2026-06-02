import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  clerkMiddleware({
    clockSkewInMs: 60000,
  })
);

app.use("/api", routes);

app.use(errorHandler);

export default app;