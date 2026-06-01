import { Router } from 'express'
import { adminDashboardPlaceholder } from '../controllers/admin.controller'
import { authenticate } from '../services/auth.middleware'
import { requireRole } from '../services/rbac.middleware'
import { Role } from '../types'

const router = Router()

router.use(authenticate, requireRole(Role.ADMIN))
router.get('/dashboard', adminDashboardPlaceholder)

export { router as adminRoutes }
