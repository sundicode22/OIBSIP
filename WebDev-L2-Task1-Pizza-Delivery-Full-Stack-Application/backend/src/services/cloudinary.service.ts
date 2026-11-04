import { Multer } from "multer";
import { cloudinaryConfig } from "../configs/cloudinary.js";

export const uploadImage = async (image: Express.Multer.File) => {
  const result = await cloudinaryConfig.uploader.upload(image.path);
  return result.secure_url;
};

export const deleteImage = async (publicId: string) => {
  await cloudinaryConfig.uploader.destroy(publicId);
};
