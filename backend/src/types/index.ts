import { Document, Types } from 'mongoose';

export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum OTPPurpose {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatar?: string;

  phone: string;
  gender: string;
  date_of_birth: string;

  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOtpVerification extends Document {
  _id: Types.ObjectId;
  email: string;
  otpHash: string;
  purpose: OTPPurpose;
  expiresAt: Date;
  attempts: number;
  tempUserData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}