import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { authRoutes } from './auth.routes'
import userRoutes from './user.routes'
import { buyerRoutes } from './buyer.routes'
import { sellerRoutes } from './seller.routes'
import { adminRoutes } from './admin.routes'
import { productRoutes } from './product.routes'
import { cartRoutes } from './cart.routes'
import { addressRoutes } from './address.routes'
import { orderRoutes } from './order.routes'
import { couponRoutes } from './coupon.routes'
import { settingsRoutes } from './settings.routes'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/buyer', buyerRoutes)
router.use('/seller', sellerRoutes)
router.use('/admin', adminRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/addresses', addressRoutes)
router.use('/orders', orderRoutes)
router.use('/coupons', couponRoutes)
router.use('/settings', settingsRoutes)

export { router as apiRoutes }
