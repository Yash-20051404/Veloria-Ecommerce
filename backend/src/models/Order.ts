import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
  RETURNED = "Returned",
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  items: any[];
  amount: number;
  paymentStatus: string;
  status: string;
  address: any;
  returnRequested: boolean;
  exchangeRequested: boolean;
  refundStatus: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: any[];
  totalAmount?: number;
  paymentMethod?: string;
  addressId?: string;
}

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  items: { type: Array, default: [] },
  addressId: {type: mongoose.Schema.Types.ObjectId,ref: "Address"},
  orderItems: {type: Array, default: []},
  totalAmount: {type: Number},
  paymentMethod: {type: String},
  amount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending' },
  status: {type: String, enum: Object.values(OrderStatus), default: OrderStatus.PROCESSING},
  address: { type: Object },
  couponCode: { type: String },
  returnRequested: { type: Boolean, default: false },
  exchangeRequested: { type: Boolean, default: false },
  refundStatus: { type: String, default: 'None' },
  deliveredAt: { type: Date }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);