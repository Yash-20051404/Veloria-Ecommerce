import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UnauthorizedError } from '../utils/errors';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid format');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'replace_with_secure_secret';

    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) throw new UnauthorizedError('User associated with token no longer exists');
    if (!user.isActive) throw new UnauthorizedError('User account is deactivated');

    // @ts-ignore - attaching user to req for downstream usage
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};