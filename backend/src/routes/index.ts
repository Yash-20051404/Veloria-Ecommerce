import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { authRoutes } from './auth.routes'
import { buyerRoutes } from './buyer.routes'
import { sellerRoutes } from './seller.routes'
import { adminRoutes } from './admin.routes'
import { productRoutes } from './product.routes'
import { cartRoutes } from './cart.routes'
import { addressRoutes } from './address.routes'
import { orderRoutes, adminOrderRoutes } from './order.routes'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/buyer', buyerRoutes)
router.use('/seller', sellerRoutes)
router.use('/admin', adminRoutes)
router.use('/admin/orders', adminOrderRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/addresses', addressRoutes)
router.use('/orders', orderRoutes)

export { router as apiRoutes }
