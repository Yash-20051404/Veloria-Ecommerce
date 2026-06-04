import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Address } from '../models/Address';
import { asyncHandler } from '../utils/asyncHandler';

export const getBuyerDashboard = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id.toString();
  // @ts-ignore
  const user = req.user;

  

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
  const totalOrders = await Order.countDocuments({ userId });
  const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  
  const profile = {
    id: user._id,
    full_name: user.name,
    email: user.email,
    phone: user.phone || '',
    gender: user.gender || 'Male',
    date_of_birth: user.date_of_birth || '',
    avatar_url: user.avatar || '',
    membership_tier: user.membership_tier || 'Silver Member',
    reward_points: user.reward_points || 0,
  };

  res.status(200).json({ 
    success: true, 
    data: {
      profile,
      orders,
      totalOrders,
      addresses,
      preferences: (user as any).preferences || null
    }
  });
  
});