import { constants } from "./constants.js";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

export const cloudinaryConfig = cloudinary.config({
  cloud_name: constants.CLOUDINARY_CLOUD_NAME,
  api_key: constants.CLOUDINARY_API_KEY,
  api_secret: constants.CLOUDINARY_API_SECRET,
});
