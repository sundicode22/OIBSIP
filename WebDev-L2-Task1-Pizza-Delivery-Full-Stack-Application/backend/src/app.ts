import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import { rootRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api", rootRouter);

  // 404 & Global Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
