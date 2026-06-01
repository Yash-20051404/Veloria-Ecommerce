import mongoose, { Schema, Document, Types } from 'mongoose';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED'
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subCategory?: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  images: string[];
  thumbnail: string;
  sellerId: Types.ObjectId;
  status: ProductStatus;
  rating: number;
  totalReviews: number;
  totalSales: number;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: String, required: true, index: true },
    subCategory: { type: String },
    brand: { type: String },
    price: { type: Number, required: true, min: 0, index: true },
    comparePrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    images: { type: [String], required: true },
    thumbnail: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE, index: true },
    rating: { type: Number, default: 0, index: true },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    tags: { type: [String], default: [], index: true },
    featured: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);