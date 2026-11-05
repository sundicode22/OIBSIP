import "multer";
import { cloudinary } from "../configs/cloudinary";

export const uploadImage = async (image: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(image.path);
  return result.secure_url;
};

export const deleteImage = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};
