import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { Role } from '../types';

const router = Router();

// Public route (To show products to customers)
router.get('/', ProductController.getAllProducts);

// Public semantic search route (Hybrid: TF-IDF + Transformer embeddings)
router.get('/search', ProductController.semanticSearch);

// AI Recommendation routes (uses cached embeddings, no model loading)
router.get('/recommendations', ProductController.getRecommendations);
router.get('/:id/similar', ProductController.getSimilarProducts);

// Admin routes (Used in Admin Panel to add/edit/delete)
router.post('/', authenticate, requireRole(Role.ADMIN), ProductController.createProduct);
router.put('/:id', authenticate, requireRole(Role.ADMIN), ProductController.updateProduct);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), ProductController.deleteProduct);

export { router as productRoutes };
