import mongoose, { Document, Schema } from 'mongoose';

export const RETURN_REASONS = [
  'Wrong Size',
  'Damaged Product',
  'Incorrect Item',
  'Changed Mind',
  'Other'
] as const;

export type ReturnReason = typeof RETURN_REASONS[number];

export const RETURN_STATUS = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PROCESSING',
  'COMPLETED'
] as const;

export type ReturnStatus = typeof RETURN_STATUS[number];

export interface IReturnItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
}

export interface IReturnRequest extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IReturnItem[];
  reason: string;
  status: ReturnStatus;
  requestType: 'RETURN' | 'EXCHANGE';
  description?: string;
  images?: string[];
  exchangeVariant?: string;
  refundStatus?: 'Pending' | 'Processing' | 'Refunded';
  adminNotes?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const ReturnRequestSchema: Schema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [ReturnItemSchema],
    reason: { type: String, required: true, trim: true, maxLength: 500 },
    requestType: { type: String, enum: ['RETURN', 'EXCHANGE'], required: true },
    status: {
      type: String,
      enum: RETURN_STATUS,
      default: 'PENDING'
    },
    description: { type: String, trim: true, maxLength: 1000 },
    images: [{ type: String }],
    exchangeVariant: { type: String, trim: true },
    refundStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Refunded'],
      default: 'Pending'
    },
    adminNotes: { type: String, trim: true, maxLength: 1000 },
    processedAt: { type: Date }
  },
  { timestamps: true }
);

// Index for efficient queries
ReturnRequestSchema.index({ orderId: 1 });
ReturnRequestSchema.index({ userId: 1 });
ReturnRequestSchema.index({ status: 1, requestType: 1 });

export const ReturnRequest = mongoose.model<IReturnRequest>('ReturnRequest', ReturnRequestSchema);