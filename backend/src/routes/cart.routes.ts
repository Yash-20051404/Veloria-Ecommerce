import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../services/auth.middleware';
import { validate } from '../services/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../utils/cart.validator';

export const cartRoutes = Router();

cartRoutes.use(authenticate); // All cart routes require user to be authenticated

cartRoutes.get('/', CartController.getCart);
cartRoutes.post('/add', validate(addToCartSchema), CartController.addToCart);
cartRoutes.patch('/item/:productId', validate(updateCartItemSchema), CartController.updateCartItem);
cartRoutes.delete('/item/:productId', CartController.removeCartItem);
cartRoutes.delete('/clear', CartController.clearCart);