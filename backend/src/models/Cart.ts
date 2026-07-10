import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAddition: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    totalItems: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);