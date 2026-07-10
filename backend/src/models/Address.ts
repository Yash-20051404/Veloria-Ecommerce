import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAddress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Address = mongoose.model<IAddress>('Address', addressSchema);