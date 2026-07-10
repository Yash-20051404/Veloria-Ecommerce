import { Order, IOrder } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product'; 
import { Address } from '../models/Address';
import { AppError } from '../utils/errors';
import { User } from '../models/User';
import { Role } from '../types';

class OrderService {
  /**
   * Computes the authoritative order total from live DB product prices.
   * Used both when finalizing an order and BEFORE creating a Razorpay order,
   * so the amount the customer is actually charged can never be set by the client.
   */
  async computeAuthoritativeTotal(items: any[]): Promise<number> {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError(400, 'No items provided to calculate order total');
    }
    let total = 0;
    for (const item of items) {
      const pid = item.productId || item.id || item._id;
      const product = pid ? await Product.findById(pid).catch(() => null) : null;
      const qty = Math.max(1, Number(item.quantity) || 1);
      if (!product) {
        throw new AppError(400, `Product with ID ${pid} is no longer available`);
      }
      if (product.stock < qty) {
        throw new AppError(400, `Insufficient stock for ${product.name}. Only ${product.stock} left.`);
      }
      total += product.price * qty;
    }
    return total;
  }

  // NOTE: `clientAmount` is intentionally accepted for backwards compatibility with
  // existing callers, but it is NEVER used to set the charged total anymore.
  // The total is always recomputed from live product prices in the DB. This closes
  // a price-tampering hole where a client could send any amount it wanted.
  async createOrder(userId: string, addressId: string, paymentMethod: string, clientItems?: any[], clientAmount?: number, clientAddress?: any): Promise<IOrder> {
    let itemsToProcess = [];
    let cart = null;

    if (clientItems && clientItems.length > 0) {
      itemsToProcess = clientItems;
    } else {
      cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        throw new AppError(400, 'Your cart is empty');
      }
      itemsToProcess = cart.items;
    }

    let validAddressId = (addressId && String(addressId).length === 24) ? addressId : null;
    let address = null;
    if (validAddressId) {
      address = await Address.findOne({ _id: validAddressId, userId }).catch(() => null);
    }

    if (!address) {
      address = clientAddress || { full_name: 'Guest User', city: 'City', country: 'India' };
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate stock and build order items using ONLY server-side, authoritative
    // product data. Client-supplied name/price/image are never trusted for pricing.
    for (const item of itemsToProcess) {
      const pid = item.productId || item.id || item._id;
      const product = pid ? await Product.findById(pid).catch(() => null) : null;
      const qty = Math.max(1, Number(item.quantity) || 1);

      if (!product) {
        throw new AppError(400, `Product with ID ${pid} is no longer available`);
      }
      if (product.stock < qty) {
        throw new AppError(400, `Insufficient stock for ${product.name}. Only ${product.stock} left.`);
      }

      const subtotal = product.price * qty;
      orderItems.push({
        productId: product._id,
        productName: product.name,
        image: product.images?.[0] || "",
        quantity: qty,
        price: product.price,
        subtotal
      });
      totalAmount += subtotal;
    }

    // Deduct stock safely (single source of truth for stock decrement — callers
    // must not also decrement stock themselves, or it will be deducted twice).
    for (const item of orderItems) {
      if (item.productId && item.productId.toString().length === 24) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }).catch(() => null);
      }
    }

    const user = await User.findById(userId).catch(() => null);

    const addressSnapshot = address ? {
      fullName: address.full_name || address.fullName || user?.name || 'Guest User',
      phone: address.phone || (user as any)?.phone || '',
      addressLine1: address.address_line_1 || address.addressLine1 || '',
      addressLine2: address.address_line_2 || address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      zip: address.postal_code || address.zip || address.pincode || ''
    } : undefined;

    // Payment status must reflect reality: COD orders aren't paid yet, and this
    // method should never be reached for RAZORPAY orders without a verified payment
    // (the controller enforces that). Only mark PAID when we know payment cleared.
    const paymentStatus = paymentMethod === 'COD' ? 'Pending' : 'Paid';

    // Create Order
    const order = await Order.create({
      userId,
      customerName: addressSnapshot?.fullName || user?.name || 'Guest User',
      email: user?.email || 'guest@veloria.com',
      phone: addressSnapshot?.phone || (user as any)?.phone || '',
      addressId: validAddressId || undefined,
      address: addressSnapshot,
      orderItems,
      items: orderItems,
      totalAmount,
      amount: totalAmount,
      paymentMethod,
      paymentStatus,
      orderId: `VEL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
    });

    // Clear DB Cart if it was explicitly used
    if (cart) {
      cart.items = [];
      cart.totalItems = 0;
      cart.totalAmount = 0;
      await cart.save();
    }

    return order;
  }

  async getMyOrders(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).sort({ createdAt: -1 });
  }

async getOrderById(id: string, userId: string, userRole: Role): Promise<IOrder> {
  const order = await Order.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { orderId: id }
    ]
  });
    if (!order) throw new AppError(404, 'Order not found');

    if (userRole === Role.BUYER && order.userId.toString() !== userId) {
      throw new AppError(403, 'You do not have permission to view this order');
    }
    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) throw new AppError(404, 'Order not found');

    if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
      throw new AppError(400, `Order cannot be cancelled because it is currently ${order.status}`);
    }

    // Restore Stock
    for (const item of (order as any).orderItems || order.items || []) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } }).catch(() => null);
    }

    order.status = 'CANCELLED';
    await order.save();
    
    return order;
  }

  async getAllOrders(query: any): Promise<IOrder[]> {
    // Basic admin retrieval
    return Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder> {
  const order = await Order.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { orderId: id }
    ]
  });
  if (!order) throw new AppError(404, 'Order not found');
  order.status = status;
  if (String(status).toUpperCase() === 'DELIVERED') {
    order.deliveredAt = new Date();
  }
  await order.save();
  return order;
}
}

export const orderService = new OrderService();
