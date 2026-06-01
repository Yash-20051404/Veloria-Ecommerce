import { Product, ProductStatus, IProduct } from '../models/Product';
import { AppError } from '../utils/errors';
import crypto from 'crypto';
import { Role } from '../types';

class ProductService {
  private generateSlug(name: string): string {
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const hash = crypto.randomBytes(3).toString('hex');
    return `${baseSlug}-${hash}`;
  }

  async createProduct(sellerId: string, data: Partial<IProduct>): Promise<IProduct> {
    const slug = this.generateSlug(data.name as string);
    
    const product = await Product.create({
      ...data,
      slug,
      sellerId,
      status: ProductStatus.ACTIVE
    });

    return product;
  }

  async getProducts(query: any): Promise<{ products: IProduct[]; total: number; page: number; totalPages: number }> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { status: ProductStatus.ACTIVE }; // Public default

    if (query.status) filter.status = query.status;
    if (query.category) filter.category = query.category;
    if (query.featured) filter.featured = query.featured === 'true';

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOption: any = { createdAt: -1 }; // Newest default
    switch (query.sort) {
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'best_rated': sortOption = { rating: -1 }; break;
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit).populate('sellerId', 'name avatar'),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id).populate('sellerId', 'name avatar');
    if (!product) {
      throw new AppError(404, 'Product not found');
    }
    return product;
  }

  async getSellerProducts(sellerId: string, query: any): Promise<{ products: IProduct[]; total: number; page: number; totalPages: number }> {
    // Same logic as getProducts but strictly filtered by sellerId and no default ACTIVE status restriction
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { sellerId };

    if (query.status) filter.status = query.status;
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { category: searchRegex }
      ];
    }

    const sortOption: any = { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateProduct(id: string, userId: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.findById(id);
    
    if (!product) throw new AppError(404, 'Product not found');
    if (product.sellerId.toString() !== userId) {
      throw new AppError(403, 'You do not have permission to update this product');
    }

    if (data.name && data.name !== product.name) {
      data.slug = this.generateSlug(data.name);
    }

    Object.assign(product, data);
    await product.save();
    
    return product;
  }

  async deleteProduct(id: string, userId: string, userRole: Role): Promise<void> {
    const product = await Product.findById(id);
    if (!product) throw new AppError(404, 'Product not found');

    if (userRole !== Role.ADMIN && product.sellerId.toString() !== userId) {
      throw new AppError(403, 'You do not have permission to delete this product');
    }

    await product.deleteOne();
  }
}

export const productService = new ProductService();