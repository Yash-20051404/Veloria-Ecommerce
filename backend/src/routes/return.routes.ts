import { Router } from 'express';
import {
  createReturnRequest,
  getMyReturns,
  getReturnById
} from '../controllers/return.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { Role } from '../types';

const router = Router();

// BUYER routes
router.post('/', authenticate, requireRole(Role.BUYER), createReturnRequest);
router.get('/my', authenticate, requireRole(Role.BUYER), getMyReturns);
router.get('/:id', authenticate, requireRole(Role.BUYER), getReturnById);

export { router as returnRoutes };