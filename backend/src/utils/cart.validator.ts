import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1)
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    // Intentionally omit productId since it comes from req.params in the update route
    quantity: z.number().int().min(1, 'Quantity must be at least 1')
  })
});