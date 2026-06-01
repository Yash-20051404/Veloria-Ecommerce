import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { validate } from '../services/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../utils/order.validator';
import { Role } from '../types';

export const orderRoutes = Router();
export const adminOrderRoutes = Router();

// === BUYER ROUTES ===
orderRoutes.use(authenticate, requireRole(Role.BUYER));

orderRoutes.post('/create', validate(createOrderSchema), OrderController.createOrder);
orderRoutes.get('/my-orders', OrderController.getMyOrders);
orderRoutes.get('/:id', OrderController.getOrderById);
orderRoutes.patch('/:id/cancel', OrderController.cancelOrder);

// === ADMIN ROUTES ===
adminOrderRoutes.use(authenticate, requireRole(Role.ADMIN));
adminOrderRoutes.get('/', OrderController.getAllOrders);
adminOrderRoutes.patch('/:id/status', validate(updateOrderStatusSchema), OrderController.updateOrderStatus);