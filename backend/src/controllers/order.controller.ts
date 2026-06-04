import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { emailService } from '../services/email.service';

// Checkout Page: Create Order
export const createOrder = async (req: any, res: any) => {
  try {
    const userId = req.user.id || req.user._id.toString();
    const { addressId, paymentMethod, items, amount, address } = req.body;
    
    let order;
    try {
      if (typeof orderService?.createOrder === 'function') {
        order = await orderService.createOrder(userId, addressId, paymentMethod || 'ONLINE', items, amount, address);
      }
    } catch (err: any) {
      console.log('Service bypassed due to error:', err.message);
    }

    if (!order) {
      const mongoose = require('mongoose');
      const OrderModel = mongoose.models.Order;
      let finalAddressId = (addressId && String(addressId).length === 24) ? addressId : null;
      if (!finalAddressId && mongoose.models.Address) {
         const fb = await mongoose.models.Address.findOne({ userId });
         if (fb) finalAddressId = fb._id;
      }
      order = await OrderModel.create({
        userId,
        customerName: address?.full_name || address?.fullName || req.user?.name || 'Guest User',
        email: req.user?.email || 'guest@veloria.com',
        phone: address?.phone || req.user?.phone || '',
        addressId: finalAddressId || undefined,
        paymentMethod: paymentMethod || 'ONLINE',
        amount: req.body.amount || 0,
        totalAmount: req.body.amount || 0,
        items: req.body.items || [],
        orderItems: req.body.items || [],
        status: 'PENDING',
        paymentStatus: 'PAID',
        orderId: `VEL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      });
    }

    // Send Order Confirmation Email
    try {
      const customerEmail = order.email || req.user?.email;
      const customerName = order.customerName || req.user?.name || 'Valued Client';
      const orderIdStr = order.orderId || order.id || order._id?.toString() || 'VEL-UNKNOWN';
      const orderAmount = order.amount || order.totalAmount || 0;
      
      if (customerEmail) {
        await emailService.sendOrderConfirmationEmail(customerEmail, customerName, orderIdStr, orderAmount);
      }
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
    }

    res.status(201).json({ success: true, message: 'Order Created Successfully', data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

// Admin Dashboard: Manage all orders
export const getAllOrders = async (req: any, res: any) => {
  try {
    let orders = [];
    if (typeof orderService?.getAllOrders === 'function') {
      orders = await orderService.getAllOrders(req.query);
    } else {
      const mongoose = require('mongoose');
      const OrderModel = mongoose.models.Order;
      if (OrderModel) orders = await OrderModel.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    }
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Admin Dashboard: Update order status
export const updateOrderStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let order;
    
    if (typeof orderService?.updateOrderStatus === 'function') {
      order = await orderService.updateOrderStatus(id, status as any);
    } else {
      const mongoose = require('mongoose');
      const OrderModel = mongoose.models.Order;
      order = await OrderModel.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderId: id }]
      });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.status = status;
      await order.save();
    }
    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Buyer Dashboard: Get My Orders
export const getMyOrders = async (req: any, res: any) => {
  try {
    const userId = req.user.id || req.user._id.toString();
    
    let orders = [];
    if (typeof orderService?.getMyOrders === 'function') {
      orders = await orderService.getMyOrders(userId);
    } else {
      const mongoose = require('mongoose');
      const OrderModel = mongoose.models.Order;
      if (OrderModel) orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).populate('addressId');
    }
    
    res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Added for Order Tracking & Success pages
export const getOrderById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Dynamic lookup by either _id or custom orderId string
    const mongoose = require('mongoose');
    const orderModel = mongoose.models.Order;
    
    if (!orderModel) {
       return res.status(500).json({ success: false, message: 'Order model not found' });
    }

    const order = await orderModel.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { orderId: id }
      ]
    }).populate('addressId');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    let progress = 10;
    const status = order.status?.toUpperCase() || 'PENDING';
    if (['ORDER_CONFIRMED', 'PENDING'].includes(status)) progress = 25;
    if (['PAYMENT_RECEIVED', 'PAID', 'PROCESSING'].includes(status)) progress = 50;
    if (['CREATION_PREPARING'].includes(status)) progress = 65;
    if (['INSURED_SHIPMENT', 'SHIPPED', 'DISPATCHED'].includes(status)) progress = 80;
    if (['OUT_FOR_DELIVERY'].includes(status)) progress = 90;
    if (['DELIVERED'].includes(status)) progress = 100;
    if (['CANCELLED', 'REFUNDED'].includes(status)) progress = 0;

    const mappedOrder = {
      id: (order as any).orderId || order._id.toString(),
      status: status,
      progress: progress,
      paymentStatus: (order as any).paymentStatus || 'PAID',
      createdAt: order.createdAt,
      estimatedArrival: (order as any).estimatedArrival || '3-5 Business Days',
      trackingNumber: (order as any).trackingNumber || `VELTRK${order._id.toString().substring(0, 6).toUpperCase()}`,
      invoiceAvailable: true,
      deliveryMethod: (order as any).deliveryMethod || "Complimentary Insured Delivery",
      timeline: ["ORDER_CONFIRMED", "PAYMENT_RECEIVED", "CREATION_PREPARING", "INSURED_SHIPMENT", "DELIVERED"],
      amount: order.totalAmount || (order as any).amount,
      items: order.items || (order as any).order_items || [],
      address: (order as any).addressId || {}
    };

    res.status(200).json({ success: true, data: mappedOrder, raw: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};