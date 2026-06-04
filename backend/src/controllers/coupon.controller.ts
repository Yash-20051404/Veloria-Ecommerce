import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/errors';

export class CouponController {
  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await Coupon.create(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
      }
      next(error);
    }
  }

  static async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, cartValue } = req.body;
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });

      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid privilege code' });
      }
      if (coupon.status !== 'Active') {
        return res.status(400).json({ success: false, message: 'This code is no longer active' });
      }
      if (coupon.minOrder > 0 && cartValue < coupon.minOrder) {
        return res.status(400).json({ success: false, message: `Minimum order value of ₹${coupon.minOrder.toLocaleString('en-IN')} required` });
      }

      res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: coupons });
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!coupon) throw new AppError(404, 'Coupon not found');
      res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndDelete(id);
      if (!coupon) throw new AppError(404, 'Coupon not found');
      res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}