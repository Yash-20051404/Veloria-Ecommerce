import { Order, OrderStatus, IOrder } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product, ProductStatus } from '../models/Product';
import { Address } from '../models/Address';
import { AppError } from '../utils/errors';
import { Role } from '../types';

class OrderService {
  async createOrder(userId: string, addressId: string, paymentMethod: string): Promise<IOrder> {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      throw new AppError(400, 'Your cart is empty');
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      throw new AppError(404, 'Delivery address not found or does not belong to you');
    }

    const orderItems = [];
    let totalAmount = 0;

    // Validate stock and build order items
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      
      if (!product || product.status !== ProductStatus.ACTIVE) {
        throw new AppError(400, `Product with ID ${item.productId} is no longer available`);
      }
      if (product.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for ${product.name}. Only ${product.stock} left.`);
      }

      const subtotal = product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        productName: product.name,
        image: product.thumbnail,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
      totalAmount += subtotal;
    }

    // Deduct stock safely
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Create Order
    const order = await Order.create({
      userId,
      addressId,
      orderItems,
      totalAmount,
      paymentMethod
    });

    // Clear Cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;
    await cart.save();

    return order;
  }

  async getMyOrders(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).sort({ placedAt: -1 });
  }

  async getOrderById(id: string, userId: string, userRole: Role): Promise<IOrder> {
    const order = await Order.findById(id).populate('addressId');
    if (!order) throw new AppError(404, 'Order not found');

    if (userRole === Role.BUYER && order.userId.toString() !== userId) {
      throw new AppError(403, 'You do not have permission to view this order');
    }
    return order;
  }

  async cancelOrder(id: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) throw new AppError(404, 'Order not found');

    if ([OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.orderStatus)) {
      throw new AppError(400, `Order cannot be cancelled because it is currently ${order.orderStatus}`);
    }

    // Restore Stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
    }

    order.orderStatus = OrderStatus.CANCELLED;
    await order.save();
    
    return order;
  }

  async getAllOrders(query: any): Promise<IOrder[]> {
    // Basic admin retrieval
    return Order.find().sort({ placedAt: -1 }).populate('userId', 'name email');
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder> {
    const order = await Order.findById(id);
    if (!order) throw new AppError(404, 'Order not found');

    order.orderStatus = status;
    await order.save();
    return order;
  }
}

export const orderService = new OrderService();
