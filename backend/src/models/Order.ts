import mongoose, { Schema, Document } from 'mongoose';

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
  amount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Paid' },
  status: { type: String, default: 'Processing' },
  address: { type: Object }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);