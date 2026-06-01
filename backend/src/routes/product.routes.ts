import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { validate } from '../services/validate.middleware';
import { createProductSchema, updateProductSchema } from '../utils/product.validator';
import { Role } from '../types';

export const productRoutes = Router();

// Public Route: List Products
productRoutes.get('/', ProductController.getProducts);

// Protected Routes (Specific paths must come before parametric paths)
productRoutes.get('/seller/my-products', authenticate, requireRole(Role.SELLER), ProductController.getSellerProducts);
productRoutes.post('/', authenticate, requireRole(Role.SELLER), validate(createProductSchema), ProductController.createProduct);
productRoutes.patch('/:id', authenticate, requireRole(Role.SELLER), validate(updateProductSchema), ProductController.updateProduct);
productRoutes.delete('/:id', authenticate, requireRole(Role.SELLER, Role.ADMIN), ProductController.deleteProduct);

// Public Route: Get specific product
productRoutes.get('/:id', ProductController.getProductById);