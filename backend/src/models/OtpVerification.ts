import mongoose, { Schema } from 'mongoose';
import { IOtpVerification, OTPPurpose } from '../types';

const otpVerificationSchema = new Schema<IOtpVerification>(
  {
    email: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: Object.values(OTPPurpose), required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
    attempts: { type: Number, default: 0 },
    tempUserData: { type: Schema.Types.Mixed, default: null } // Stores registration data temporarily
  },
  { timestamps: true }
);

export const OtpVerification = mongoose.model<IOtpVerification>(
  'OtpVerification',
  otpVerificationSchema
);