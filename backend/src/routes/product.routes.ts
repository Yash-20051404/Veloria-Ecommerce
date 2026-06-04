import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// Public route (To show products to customers)
router.get('/', ProductController.getAllProducts);

// Admin routes (Used in Admin Panel to add/edit/delete)
router.post('/', ProductController.createProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export { router as productRoutes };