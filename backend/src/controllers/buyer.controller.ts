import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Address } from '../models/Address';
import { asyncHandler } from '../utils/asyncHandler';

export const getBuyerDashboard = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id.toString();

  const recentOrders = await Order.find({ userId })
    .sort({ placedAt: -1 })
    .limit(3)
    .populate('addressId');
    
  const totalOrders = await Order.countDocuments({ userId });
  const defaultAddress = await Address.findOne({ userId, isDefault: true });

  res.status(200).json({ 
    success: true, 
    data: {
      recentOrders,
      totalOrders,
      defaultAddress
    }
  });
});