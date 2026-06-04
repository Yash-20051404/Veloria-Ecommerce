import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../utils/errors';
import { uploadBase64Image } from '../utils/cloudinary';

export class ProductController {
  
  // 1. CREATE PRODUCT (Add new product)
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Fallback: Auto-generate slug if it's missing from the request
      if (req.body.name && !req.body.slug) {
        req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
      }

      // Upload base64 images to Cloudinary
      if (req.body.images && Array.isArray(req.body.images)) {
        const uploadedImages = [];
        for (const img of req.body.images) {
          if (img.startsWith('data:image')) {
            const url = await uploadBase64Image(img);
            uploadedImages.push(url);
          } else {
            uploadedImages.push(img);
          }
        }
        req.body.images = uploadedImages;
      }

      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: product
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate Error: A product with this slug/name already exists.' });
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
      }
      next(error);
    }
  }

  // 2. GET ALL PRODUCTS (Read products for UI)
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetch all products, newest first
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  // 3. UPDATE PRODUCT (Edit product)
  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Upload new base64 images to Cloudinary
      if (req.body.images && Array.isArray(req.body.images)) {
        const uploadedImages = [];
        for (const img of req.body.images) {
          if (img.startsWith('data:image')) {
            const url = await uploadBase64Image(img);
            uploadedImages.push(url);
          } else {
            uploadedImages.push(img);
          }
        }
        req.body.images = uploadedImages;
      }

      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      
      if (!product) throw new AppError(404, 'Product not found');
      
      res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate Error: A product with this detail already exists.' });
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
      }
      next(error);
    }
  }

  // 4. DELETE PRODUCT
  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) throw new AppError(404, 'Product not found');
      
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}