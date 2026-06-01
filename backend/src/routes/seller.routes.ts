import { Router } from 'express'
import { sellerDashboardPlaceholder } from '../controllers/seller.controller'
import { authenticate } from '../services/auth.middleware'
import { requireRole } from '../services/rbac.middleware'
import { Role } from '../types'

const router = Router()

router.use(authenticate, requireRole(Role.SELLER))
router.get('/dashboard', sellerDashboardPlaceholder)

export { router as sellerRoutes }
