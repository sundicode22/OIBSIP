import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(morgan("dev"));

  return app;
};
