import { z } from 'zod';
import { ProductStatus } from '../models/Product';

const baseProductSchema = {
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  comparePrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  status: z.nativeEnum(ProductStatus).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional()
};

export const createProductSchema = z.object({
  body: z.object(baseProductSchema)
});

export const updateProductSchema = z.object({
  body: z.object({
    name: baseProductSchema.name.optional(),
    description: baseProductSchema.description.optional(),
    shortDescription: baseProductSchema.shortDescription.optional(),
    category: baseProductSchema.category.optional(),
    subCategory: baseProductSchema.subCategory.optional(),
    brand: baseProductSchema.brand.optional(),
    price: baseProductSchema.price.optional(),
    comparePrice: baseProductSchema.comparePrice.optional(),
    stock: baseProductSchema.stock.optional(),
    sku: baseProductSchema.sku.optional(),
    images: baseProductSchema.images.optional(),
    thumbnail: baseProductSchema.thumbnail.optional(),
    status: baseProductSchema.status.optional(),
    tags: baseProductSchema.tags.optional(),
    featured: baseProductSchema.featured.optional()
  })
});