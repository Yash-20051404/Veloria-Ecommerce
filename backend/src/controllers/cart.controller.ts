import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { asyncHandler } from '../utils/asyncHandler';

export class CartController {
  static getCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const cart = await cartService.getCart(userId);
    res.status(200).json({ success: true, data: cart });
  });

  static addToCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
  });

  static updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const cart = await cartService.updateCartItem(userId, req.params.productId, req.body.quantity);
    res.status(200).json({ success: true, message: 'Cart updated', data: cart });
  });

  static removeCartItem = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    const cart = await cartService.removeCartItem(userId, req.params.productId);
    res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
  });

  static clearCart = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user._id.toString();
    await cartService.clearCart(userId);
    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  });
}