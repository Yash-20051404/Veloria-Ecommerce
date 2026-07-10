import mongoose, { Schema, Document , Types} from 'mongoose';

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  metal?: string;
  purity?: string;
  gemstone?: string;
  occasion?: string;
  weight?: number;
  sku?: string;
  slug: string;
  status: ProductStatus;
  sellerId: Types.ObjectId;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    // Images array of strings (URLs)
    images: [{ type: String, default: [] }],
    metal: { type: String },
    purity: { type: String },
    gemstone: { type: String },
    occasion: { type: String },
    weight: { type: Number },
    sku: { type: String },
    slug: { type: String, unique: true, sparse: true },
    sellerId: {type: Schema.Types.ObjectId, ref: "User", required: false},
    status: {type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE},
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

ProductSchema.pre('validate', function (this: IProduct) {
  if (this.name && !this.slug) {
    this.slug =
      this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Math.random().toString(36).substring(2, 8);
  }
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);