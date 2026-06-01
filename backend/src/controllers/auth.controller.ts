import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { User } from '../models/User';
import { OtpVerification } from '../models/OtpVerification';
import { AppError } from '../utils/errors';
import { OTPPurpose } from '../types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.registerInit(req.body);
      res.status(202).json({
        success: true,
        message: 'Registration initiated. Please verify your email with the OTP sent.'
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyEmail(email, otp);
      res.status(201).json({
        success: true,
        message: 'Email verified successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, purpose } = req.body;
      await authService.resendOtp(email, purpose);
      res.status(200).json({ success: true, message: 'A new OTP has been sent to your email.' });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ success: true, message: 'Logged in successfully', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json({ success: true, message: 'If the email is registered, an OTP has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  static async verifyResetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyResetOtp(req.body.email, req.body.otp);
      res.status(200).json({ success: true, message: 'OTP verified', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, resetToken, newPassword } = req.body;
      const secret = process.env.JWT_SECRET || 'replace_with_secure_secret';
      
      // Verify token
      jwt.verify(resetToken, secret);

      const user = await User.findOne({ email });
      if (!user) throw new AppError(404, 'User not found');

      user.passwordHash = await bcrypt.hash(newPassword, 12);
      await user.save();
      
      // Invalidate existing reset OTPs globally
      await OtpVerification.deleteMany({ email, purpose: OTPPurpose.PASSWORD_RESET });

      res.status(200).json({ success: true, message: 'Password has been successfully reset' });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        return next(new AppError(401, 'Invalid or expired reset token'));
      }
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      res.status(200).json({ success: true, data: { user: req.user } });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    // JWT is stateless; logout is handled client-side by dropping the token.
    // Alternatively, you could implement a token blocklist in Redis for extreme security.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}