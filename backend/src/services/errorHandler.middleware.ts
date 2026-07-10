import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.reduce((acc, e) => {
        const fieldName = e.path.slice(1).join('.'); // from ["body", "fullName"] to "fullName"
        acc[fieldName] = e.message;
        return acc;
      }, {} as Record<string, string>)
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Fallback for unhandled/unknown errors
  console.error('[Unhandled Error]: ', err);
  const statusCode = 500;
  res.status(statusCode).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};