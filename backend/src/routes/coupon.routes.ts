import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { Role } from '../types';

const router = Router();

// Public: buyers apply/validate a code at checkout
router.post('/validate', CouponController.validateCoupon);

// Admin-only: managing coupons
router.get('/', authenticate, requireRole(Role.ADMIN), CouponController.getAllCoupons);
router.post('/', authenticate, requireRole(Role.ADMIN), CouponController.createCoupon);
router.put('/:id', authenticate, requireRole(Role.ADMIN), CouponController.updateCoupon);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), CouponController.deleteCoupon);

export { router as couponRoutes };