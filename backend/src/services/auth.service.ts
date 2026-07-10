import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { OtpVerification } from '../models/OtpVerification';
import { emailService } from './email.service';
import { Role, OTPPurpose, IUser } from '../types';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  OTPExpiredError,
  OTPInvalidError,
  UserNotFoundError,
  AppError
} from '../utils/errors';

class AuthService {
  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private generateTokens(user: IUser) {
    const payload = { userId: user._id, role: user.role };
    const secret = env.jwtSecret;
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return { token };
  }

  async registerInit(data: any): Promise<void> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    // Invalidate existing registration OTPs for this email
    await OtpVerification.deleteMany({ email: data.email, purpose: OTPPurpose.EMAIL_VERIFICATION });

    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(data.password, 12);

    const tempUserData = {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role
    };

    await OtpVerification.create({
      email: data.email,
      otpHash,
      purpose: OTPPurpose.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      tempUserData
    });

    await emailService.sendVerificationOTP(data.email, otp, data.name);
  }

  async verifyEmail(email: string, otp: string): Promise<{ user: IUser; token: string }> {
    const otpRecord = await OtpVerification.findOne({
      email,
      purpose: OTPPurpose.EMAIL_VERIFICATION
    });

    if (!otpRecord) throw new OTPExpiredError('OTP not found or has expired');
    
    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();
      throw new AppError(429, 'Maximum OTP attempts reached. Please request a new code.');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new OTPInvalidError();
    }

    // OTP is valid, proceed with account creation
    const userData = otpRecord.tempUserData;
    if (!userData) throw new AppError(500, 'Registration data lost, please try again');

    const user = await User.create({
      ...userData,
      isEmailVerified: true,
      lastLogin: new Date()
    });

    await otpRecord.deleteOne();
    await emailService.sendWelcomeEmail(user.email, user.name);

    const { token } = this.generateTokens(user);
    return { user, token };
  }

  async resendOtp(email: string, purpose: OTPPurpose): Promise<void> {
    if (purpose === OTPPurpose.PASSWORD_RESET) {
      const user = await User.findOne({ email });
      if (!user) throw new UserNotFoundError();
    }

    let name = 'User';
    if (purpose === OTPPurpose.EMAIL_VERIFICATION) {
      const record = await OtpVerification.findOne({ email, purpose }).sort({ createdAt: -1 });
      if (record?.tempUserData?.name) name = record.tempUserData.name;
    }

    await OtpVerification.deleteMany({ email, purpose });
    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await OtpVerification.create({
      email,
      otpHash,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    if (purpose === OTPPurpose.EMAIL_VERIFICATION) {
      await emailService.sendVerificationOTP(email, otp, name);
    } else {
      await emailService.sendPasswordResetOTP(email, otp);
    }
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) throw new InvalidCredentialsError();

    if (!user.isEmailVerified) throw new AppError(403, 'Email is not verified. Please verify your email first.');
    if (!user.isActive) throw new AppError(403, 'Account is disabled. Please contact support.');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new InvalidCredentialsError();

    user.lastLogin = new Date();
    await user.save();

    const { token } = this.generateTokens(user);
    return { user, token };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) return; // Silent fail for security

    await OtpVerification.deleteMany({ email, purpose: OTPPurpose.PASSWORD_RESET });

    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await OtpVerification.create({
      email,
      otpHash,
      purpose: OTPPurpose.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await emailService.sendPasswordResetOTP(email, otp);
  }

  async verifyResetOtp(email: string, otp: string): Promise<{ resetToken: string }> {
    const otpRecord = await OtpVerification.findOne({ email, purpose: OTPPurpose.PASSWORD_RESET });
    if (!otpRecord) throw new OTPExpiredError();

    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();
      throw new AppError(429, 'Maximum OTP attempts reached. Request a new one.');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new OTPInvalidError();
    }

    const secret = env.jwtSecret;
    const resetToken = jwt.sign({ email, purpose: 'PASSWORD_RESET' }, secret, { expiresIn: '15m' });
    
    await otpRecord.deleteOne();
    return { resetToken };
  }

  async inviteAdmin(email: string): Promise<void> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(409, 'A user with this email already exists.');
    }

    // Create a short-lived token for the invitation
    const invitationToken = jwt.sign({ email, role: Role.ADMIN }, env.jwtSecret, {
      expiresIn: '24h',
    });

    await emailService.sendAdminInvitation(email, invitationToken);
  }

  async createAdminFromInvitation(token: string, name: string, password: string): Promise<void> {
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (error) {
      throw new AppError(400, 'Invalid or expired invitation token. Please request a new one.');
    }

    const { email, role } = decoded;

    if (role !== Role.ADMIN) {
      throw new AppError(400, 'This invitation is not valid for creating an admin account.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(409, 'A user with this email already exists.');
    }

    // Invalidate any previous attempts for this email
    await OtpVerification.deleteMany({ email, purpose: OTPPurpose.EMAIL_VERIFICATION });

    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 12);

    const tempUserData = { name, email, passwordHash, role: Role.ADMIN };

    await OtpVerification.create({
      email,
      otpHash,
      purpose: OTPPurpose.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      tempUserData,
    });

    await emailService.sendVerificationOTP(email, otp, name);
  }
}

export const authService = new AuthService();