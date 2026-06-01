import mongoose, { Schema, Document, Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface IOrderItem {
  productId: Types.ObjectId;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  addressId: Types.ObjectId;
  orderItems: IOrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  placedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: true },
    orderItems: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PLACED, index: true },
    placedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
