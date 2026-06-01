import { Cart, ICart } from '../models/Cart';
import { Product, ProductStatus } from '../models/Product';
import { AppError } from '../utils/errors';

class CartService {
  private calculateTotals(cart: ICart): void {
    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.quantity * item.priceAtAddition), 0);
  }

  private async getOrCreateCart(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalItems: 0, totalAmount: 0 });
    }
    return cart;
  }

  async getCart(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name slug thumbnail price stock status');
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalItems: 0, totalAmount: 0 });
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<ICart> {
    const product = await Product.findById(productId);
    
    if (!product) throw new AppError(404, 'Product not found');
    if (product.status !== ProductStatus.ACTIVE) throw new AppError(400, 'Product is no longer available');
    
    const cart = await this.getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        throw new AppError(400, `Insufficient stock. Only ${product.stock} items available.`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAddition = product.price; // Update to latest price
    } else {
      if (product.stock < quantity) {
        throw new AppError(400, `Insufficient stock. Only ${product.stock} items available.`);
      }
      // @ts-ignore
      cart.items.push({ productId, quantity, priceAtAddition: product.price });
    }

    this.calculateTotals(cart);
    await cart.save();
    
    return this.getCart(userId); // Return populated cart
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId);
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    
    if (existingItemIndex === -1) {
      throw new AppError(404, 'Product is not in your cart');
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new AppError(400, 'Product is no longer available');
    }
    
    if (product.stock < quantity) {
      throw new AppError(400, `Insufficient stock. Only ${product.stock} items available.`);
    }

    cart.items[existingItemIndex].quantity = quantity;
    cart.items[existingItemIndex].priceAtAddition = product.price;
    
    this.calculateTotals(cart);
    await cart.save();
    
    return this.getCart(userId);
  }

  async removeCartItem(userId: string, productId: string): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId);
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    this.calculateTotals(cart);
    await cart.save();
    
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId);
    
    cart.items = [];
    this.calculateTotals(cart);
    await cart.save();
    
    return cart;
  }
}

export const cartService = new CartService();