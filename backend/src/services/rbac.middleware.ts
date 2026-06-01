import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';
import { UnauthorizedError, AppError } from '../utils/errors';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError('User not authenticated'));
    }
    if (!allowedRoles.includes(user.role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};