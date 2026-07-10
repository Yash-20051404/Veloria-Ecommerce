import { Router } from 'express';
import { 
  getOrderById,
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus,
  downloadInvoice
} from '../controllers/order.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { Role } from '../types';

export const orderRoutes = Router();

// Checkout Page: Create a new order
orderRoutes.post('/', authenticate, createOrder);

// Buyer Dashboard: Fetch user's past orders
orderRoutes.get('/customer/:email', authenticate, getMyOrders);

// Admin Dashboard: Manage all orders
orderRoutes.get('/', authenticate, requireRole(Role.ADMIN), getAllOrders);
orderRoutes.put('/:id/status', authenticate, requireRole(Role.ADMIN), updateOrderStatus);

// Download Invoice Route
// (must be authenticated: the controller's canAccessOrder() check relies on
// req.user being populated, and without this middleware every request here
// — including the actual order owner — was being rejected as unauthorized.)
orderRoutes.get('/:id/invoice', authenticate, downloadInvoice);

// Route for single order fetching (Order Tracking)
orderRoutes.get('/:id', authenticate, getOrderById);