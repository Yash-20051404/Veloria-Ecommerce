import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AppError } from '../utils/errors';
import { emailService } from '../services/email.service';
import { Settings } from '../models/Settings';
import { generateInvoicePDF } from '../utils/pdfInvoice';

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerName, email, phone, items, amount, address } = req.body;

      // Decrease stock for each purchased item
      for (const item of items) {
        const product = await Product.findById(item.id);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }

      // Generate a unique Order ID (e.g. VEL-123456)
      const orderId = 'VEL-' + Math.floor(100000 + Math.random() * 900000);

      const order = await Order.create({
        orderId, customerName, email, phone, items, amount, address,
        paymentStatus: 'Paid', status: 'Processing'
      });

      // Send Order Confirmation Email based on Admin Settings
      const settings = await Settings.findOne();
      if (!settings || settings.orderConfEmail !== false) {
        emailService.sendOrderConfirmationEmail(email, customerName, orderId, amount).catch(console.error);
      }

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await Order.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
      if (!order) throw new AppError(404, 'Order not found');
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async downloadInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let order;
      // Check if id is a valid Mongo ObjectId or our custom VEL-xxxx format
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      } else {
        order = await Order.findOne({ orderId: id });
      }

      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      generateInvoicePDF(order, res);
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const orders = await Order.find({ email }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }
}