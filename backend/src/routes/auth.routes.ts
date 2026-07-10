import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../services/validate.middleware';
import { authenticate } from '../services/auth.middleware';
import { authLimiter, otpLimiter } from '../services/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/auth.validator';

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, validate(registerSchema), AuthController.register);
authRoutes.post('/verify-email', authLimiter, validate(verifyEmailSchema), AuthController.verifyEmail);
authRoutes.post('/resend-otp', otpLimiter, validate(resendOtpSchema), AuthController.resendOtp);
authRoutes.post('/create-admin', authLimiter, AuthController.createAdmin);
authRoutes.post('/login', authLimiter, validate(loginSchema), AuthController.login);
authRoutes.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
authRoutes.post('/verify-reset-otp', authLimiter, AuthController.verifyResetOtp); // Add custom validation if needed
authRoutes.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

authRoutes.get('/me', authenticate, AuthController.getMe);
authRoutes.post('/logout', authenticate, AuthController.logout);