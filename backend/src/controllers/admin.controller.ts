import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { User } from "../models/User";
import { Order } from '../models/Order';
import { Role } from "../types";

export class AdminController {
  static async inviteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.inviteAdmin(email);
      res.status(200).json({
        success: true,
        message: `An invitation has been sent to ${email}.`
      });
    } catch (error) {
      next(error);
    }
  }


  static async getCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const buyers = await User.find({
      role: Role.BUYER // agar error aaye to "buyer" use kar dena
    }).lean();

    const orders = await Order.find().lean();

    const customers = buyers.map((buyer: any) => {
      const customerOrders = orders.filter(
        (o: any) =>
          String(o.userId) === String(buyer._id) ||
          (
            o.email &&
            buyer.email &&
            o.email.toLowerCase() === buyer.email.toLowerCase()
          )
      );

      const totalSpent = customerOrders.reduce(
        (sum: number, o: any) => sum + (Number(o.amount) || 0),
        0
      );

      return {
        id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone || 'N/A',
        orders: customerOrders.length,
        totalSpent,
        memberSince: buyer.createdAt,
        status: 'Active'
      };
    });

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
}
}