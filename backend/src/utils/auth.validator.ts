import { z } from 'zod';
import { Role } from '../types';

// Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwordMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().regex(passwordRegex, passwordMessage),
    role: z.nativeEnum(Role).refine((val) => val === Role.BUYER || val === Role.SELLER, {
      message: 'Role must be either BUYER or SELLER during registration'
    })
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits')
  })
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    purpose: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET'])
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    resetToken: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().regex(passwordRegex, passwordMessage)
  })
});