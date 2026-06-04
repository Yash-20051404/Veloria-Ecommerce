import mongoose, { Schema } from 'mongoose';
import { IUser, Role } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: Role.BUYER },
    avatar: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    phone: {type: String, default: ''},
    gender: {type: String, default: 'Male'},
    date_of_birth: {type: String, default: ''},
  },
  { timestamps: true }
);

// Remove sensitive data when returning user object
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

export const User = mongoose.model<IUser>('User', userSchema);