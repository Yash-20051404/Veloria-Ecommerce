import { v2 as cloudinary } from 'cloudinary';
import { AppError } from './errors';

export const uploadBase64Image = async (base64String: string): Promise<string> => {
  // Configure Cloudinary inside the function to ensure environment variables 
  // are loaded before configuration takes place.
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'veloria-products',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new AppError(500, 'Failed to upload image to Cloudinary');
  }
};