import { Router } from 'express'
import { getBuyerDashboard } from '../controllers/buyer.controller'
import { authenticate } from '../services/auth.middleware'
import { requireRole } from '../services/rbac.middleware'
import { Role } from '../types'

const router = Router()

router.use(authenticate, requireRole(Role.BUYER))
router.get('/dashboard', getBuyerDashboard)

export { router as buyerRoutes }
