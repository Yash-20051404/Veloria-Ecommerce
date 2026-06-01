import { z } from 'zod';
import { OrderStatus } from '../models/Order';

export const createOrderSchema = z.object({
  body: z.object({
    addressId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Address ID format'),
    paymentMethod: z.string().min(2, 'Payment method is required')
  })
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus)
  })
});