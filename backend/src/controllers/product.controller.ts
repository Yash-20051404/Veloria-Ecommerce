import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';

export class ProductController {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const sellerId = req.user._id.toString();
      const product = await productService.createProduct(sellerId, req.body);
      
      res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getProducts(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  static async getSellerProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const sellerId = req.user._id.toString();
      const result = await productService.getSellerProducts(sellerId, req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const updatedProduct = await productService.updateProduct(req.params.id, req.user._id.toString(), req.body);
      res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      await productService.deleteProduct(req.params.id, req.user._id.toString(), req.user.role);
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}