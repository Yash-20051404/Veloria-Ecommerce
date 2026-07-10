import { orderService } from '../services/order.service';
import { emailService } from '../services/email.service';
import { Coupon } from '../models/Coupon';
import { Role } from '../types';
import puppeteer from 'puppeteer';

// Checkout Page: Create Order.
//
// SECURITY: this endpoint is authenticated-only (no payment proof required), so it
// must NEVER be allowed to create an order that claims to be paid via an online
// gateway — that would let anyone get a free "PAID" order without paying.
// It is restricted to Cash-on-Delivery. Card/UPI/Razorpay orders can only be
// created via the verified flow in payment.controller.ts (createRazorpayOrder ->
// verifyPayment), which checks the Razorpay signature before an order is created.
//
// The order total is always computed server-side from live product prices
// (see orderService.createOrder) — any `amount` sent by the client is ignored.
export const createOrder = async (req: any, res: any) => {
  try {
    const userId = req.user.id || req.user._id.toString();
    const { addressId, paymentMethod, items, address, couponCode } = req.body;

    const normalizedMethod = String(paymentMethod || 'COD').toUpperCase();
    if (normalizedMethod !== 'COD') {
      return res.status(400).json({
        success: false,
        message: 'Online payments must be completed and verified via /payment/create-order and /payment/verify before an order can be created.'
      });
    }

    const order = await orderService.createOrder(userId, addressId, 'COD', items, undefined, address);

    // Update coupon usage count (stock is already decremented inside orderService)
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: String(couponCode).toUpperCase() },
        { $inc: { usedCount: 1 } }
      ).catch((err) => console.error('Failed to update coupon usage:', err));
    }

    // Send Order Confirmation Email (best-effort, never blocks the response)
    try {
      const customerEmail = order.email || req.user?.email;
      const customerName = order.customerName || req.user?.name || 'Valued Client';
      const orderIdStr = order.orderId || (order as any).id || order._id?.toString() || 'VEL-UNKNOWN';
      const orderAmount = order.amount || order.totalAmount || 0;

      if (customerEmail) {
        await emailService.sendOrderConfirmationEmail(customerEmail, customerName, orderIdStr, orderAmount);
      }
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
    }

    res.status(201).json({ success: true, message: 'Order Created Successfully', data: order });
  } catch (error: any) {
    res.status(error?.statusCode || 400).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

// Returns true if the requesting user is allowed to view/download this order:
// admins/sellers can view any order, buyers can only view their own.
function canAccessOrder(reqUser: any, order: any): boolean {
  if (!reqUser) return false;
  if (reqUser.role === Role.ADMIN || reqUser.role === Role.SELLER) return true;
  const requesterId = (reqUser.id || reqUser._id)?.toString();
  return !!requesterId && order.userId?.toString() === requesterId;
}

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
      const query = id.match(/^[0-9a-fA-F]{24}$/) 
        ? { $or: [{ _id: id }, { orderId: id }] }
        : { orderId: id };
      order = await OrderModel.findOne(query);
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
      if (OrderModel) orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
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

    const query = id.match(/^[0-9a-fA-F]{24}$/) 
      ? { $or: [{ _id: id }, { orderId: id }] }
      : { orderId: id };

    const order = await orderModel.findOne(query)

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to view this order' });
    }

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
      _id: order._id.toString(),
      orderId: (order as any).orderId || undefined,
      status: status,
      progress: progress,
      paymentStatus: (order as any).paymentStatus || 'PAID',
      createdAt: order.createdAt,
      estimatedArrival: (order as any).estimatedArrival || '2-3 Business Days',
      trackingNumber: (order as any).trackingNumber || `VELTRK${order._id.toString().substring(0, 6).toUpperCase()}`,
      invoiceAvailable: true,
      deliveryMethod: (order as any).deliveryMethod || "Complimentary Insured Delivery",
      timeline: ["ORDER_CONFIRMED", "PAYMENT_RECEIVED", "CREATION_PREPARING", "INSURED_SHIPMENT", "DELIVERED"],
      amount: order.totalAmount || (order as any).amount,
      items: order.items || (order as any).order_items || [],
      customerName: order.customerName,
      phone: order.phone,
      address: order.address || (order as any).addressId || {}
    };

    res.status(200).json({ success: true, data: mappedOrder, raw: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Download Invoice - Fetches Order by ObjectID or Custom OrderId (VEL-XXXX)
export const downloadInvoice = async (req: any, res: any) => {
  console.log("PDF INVOICE CONTROLLER HIT");
  try {
    const { id } = req.params;

    const mongoose = require('mongoose');
    const orderModel = mongoose.models.Order;

    if (!orderModel) {
      return res.status(500).json({
        success: false,
        message: 'Order model not found'
      });
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ _id: id }, { orderId: id }] }
      : { orderId: id };

    const order = await orderModel.findOne(query)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!canAccessOrder(req.user, order)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this invoice'
      });
    }

    const itemsHtml = (order.items || order.orderItems || [])
    .map((item: any) => `
      <tr>
        <td style="padding:16px;border-bottom:1px solid #eee;">
          <div style="display:flex;align-items:center;gap:12px;">
            <img
             src="${
                item.image ||
                item.images?.[0] ||
                item.product?.image ||
                item.product?.images?.[0] ||
                ''
              }"
              width="70"
              height="70"
              style="border-radius:10px;object-fit:cover;border:1px solid #ddd;"
            />
            <div>
              <div style="font-weight:600;">
                ${item.name || item.productName || 'Veloria Creation'}
              </div>
            </div>
          </div>
        </td>

        <td style="padding:16px;border-bottom:1px solid #eee;text-align:center;">
          ${item.quantity || 1}
        </td>

        <td style="padding:16px;border-bottom:1px solid #eee;text-align:right;">
          ₹${Number(item.price || 0).toLocaleString('en-IN')}
        </td>

        <td style="padding:16px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">
          ₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
        </td>
      </tr>
    `)
    .join('');

    const subtotal = Number(order.amount || order.totalAmount || 0);
    const shipping = Number(order.shippingAmount || 0);
    const tax = Number(order.taxAmount || 0);
    const grandTotal =
      Number(order.totalAmount || order.amount || 0);

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8" />

    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

    <style>

    *{
    margin:0;
    padding:0;
    box-sizing:border-box;
    }

    body{
    background:#f4f4f4;
    padding:40px;
    font-family:'Inter',sans-serif;
    color:#111;
    }

    .invoice{
    max-width:950px;
    margin:auto;
    background:#fff;
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 20px 60px rgba(0,0,0,.08);
    }

    .topbar{
    height:8px;
    background:#D6B57A;
    }

    .content{
    padding:35px;
    }

    .header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    margin-bottom:50px;
    }

    .logo{
    font-family:'Cormorant Garamond',serif;
    font-size:34px;
    letter-spacing:8px;
    color:#D6B57A;
    }

    .tagline{
    margin-top:8px;
    font-size:13px;
    color:#777;
    }

    .invoice-meta{
    text-align:right;
    }

    .invoice-meta h2{
    font-size:28px;
    margin-bottom:10px;
    }

    .order-id{
    color:#D6B57A;
    font-weight:600;
    }

    .grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:40px;
    margin-bottom:40px;
    }

    .card{
    background:#fafafa;
    border-radius:16px;
    padding:24px;
    border:1px solid #eee;
    }

    .label{
    font-size:11px;
    letter-spacing:2px;
    text-transform:uppercase;
    color:#888;
    margin-bottom:10px;
    }

    .value{
    font-size:13px;
    line-height:1.6;
    }

    table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
    }

    thead{
    background:#111;
    color:white;
    }

    th{
    padding:18px;
    font-size:12px;
    letter-spacing:2px;
    text-transform:uppercase;
    }

    .summary{
    display:flex;
    justify-content:flex-end;
    margin-top:30px;
    }

    .summary-box{
    width:320px;
    }

    .row{
    display:flex;
    justify-content:space-between;
    padding:12px 0;
    border-bottom:1px solid #eee;
    }

    .total{
    font-size:26px;
    font-weight:700;
    color:#D6B57A;
    padding-top:20px;
    }

    .footer{
    margin-top:60px;
    text-align:center;
    font-size:12px;
    color:#777;
    }

    </style>
    </head>

    <body>

    <div class="invoice">

    <div class="topbar"></div>

    <div class="content">

    <div class="header">

    <div>
    <div class="logo">VELORIA</div>
    <div class="tagline">Luxury Jewellery Maison</div>
    </div>

    <div class="invoice-meta">
    <h2>INVOICE</h2>
    <div class="order-id">${order.orderId}</div>
    </div>

    </div>

    <div class="grid">

    <div class="card">
    <div class="label">Customer Details</div>

    <div class="value">
    <strong>${order.customerName || ''}</strong><br/>
    ${order.email || ''}<br/>
    ${order.phone || ''}<br/><br/>
    ${order.address?.fullName || ''}
    ${order.address?.phone || ''}
    ${order.address?.addressLine1 || ''}
    ${order.address?.addressLine2 || ''}
    ${order.address?.city || ''}
    ${order.address?.state || ''}
    ${order.address?.zip || ''}
    ${order.address?.country || ''}
    </div>
    </div>

    <div class="card">
    <div class="label">Order Information</div>

    <div class="value">
    Invoice #: INV-${order.orderId}<br/>
    Order ID: ${order.orderId}<br/>
    Date: ${new Date(order.createdAt).toLocaleDateString()}<br/>
    Payment Method: ${order.paymentMethod || 'ONLINE'}<br/>
    Payment: ${order.paymentStatus || 'PAID'}
    </div>

    </div>

    </div>

    <table>

    <thead>
    <tr>
    <th>Product</th>
    <th>Qty</th>
    <th>Price</th>
    <th>Total</th>
    </tr>
    </thead>

    <tbody>
    ${itemsHtml}
    </tbody>

    </table>

    <div class="summary">

    <div class="summary-box">

    <div class="row">
      <span>Subtotal</span>
      <span>₹${subtotal.toLocaleString('en-IN')}</span>
    </div>

    <div class="row">
      <span>Shipping</span>
      <span>₹${shipping.toLocaleString('en-IN')}</span>
    </div>

    <div class="row">
      <span>Tax</span>
      <span>₹${tax.toLocaleString('en-IN')}</span>
    </div>

    <div class="row total">
      <span>Grand Total</span>
      <span>₹${grandTotal.toLocaleString('en-IN')}</span>
    </div>

    </div>

    </div>

    <div class="footer">
    Thank you for choosing Veloria.<br/>
    This invoice was generated automatically.
    </div>

    </div>

    </div>

    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'load'
    });

const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: {
    top: '10px',
    right: '10px',
    bottom: '10px',
    left: '10px'
  }
});

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Veloria-Invoice-${order.orderId || id}.pdf`
    );

    return res.send(pdf);

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};