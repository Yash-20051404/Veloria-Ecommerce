import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  usageLimit?: number;
  perUser?: number;
  status: 'Active' | 'Draft' | 'Expired';
  usedCount: number;
  expiryDate?: Date;
}

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  usageLimit: { type: Number },
  perUser: { type: Number, default: 1 },
  status: { type: String, enum: ['Active', 'Draft', 'Expired'], default: 'Active' },
  expiryDate: {type: Date},
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);