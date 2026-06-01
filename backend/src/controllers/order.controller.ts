import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';

export class OrderController {
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const { addressId, paymentMethod } = req.body;
    
    const order = await orderService.createOrder(userId, addressId, paymentMethod);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  });

  static getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const orders = await orderService.getMyOrders(userId);
    res.status(200).json({ success: true, data: orders });
  });

  static getOrderById = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    // @ts-ignore
    const role = req.user.role;
    const order = await orderService.getOrderById(req.params.id, userId, role);
    res.status(200).json({ success: true, data: order });
  });

  static cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const order = await orderService.cancelOrder(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  });

  // --- ADMIN ENDPOINTS ---

  static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderService.getAllOrders(req.query);
    res.status(200).json({ success: true, data: orders });
  });

  static updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  });
}