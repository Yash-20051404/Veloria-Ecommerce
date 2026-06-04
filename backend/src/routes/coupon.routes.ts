import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';

const router = Router();

router.get('/', CouponController.getAllCoupons);
router.post('/validate', CouponController.validateCoupon);
router.post('/', CouponController.createCoupon);
router.put('/:id', CouponController.updateCoupon);
router.delete('/:id', CouponController.deleteCoupon);

export { router as couponRoutes };