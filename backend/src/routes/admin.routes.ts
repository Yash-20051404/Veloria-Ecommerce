import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import {
  getAllReturns,
  updateReturnStatus,
  markRefundStatus,
  markExchangeComplete,
  addAdminNotes
} from '../controllers/return.controller'
import { authenticate } from '../services/auth.middleware'
import { requireRole } from '../services/rbac.middleware'
import { Role } from '../types'

const router = Router()

router.use(authenticate, requireRole(Role.ADMIN))
router.get('/dashboard', (req, res) => res.json({ message: 'Welcome to the admin dashboard' }));
router.post('/invite', AdminController.inviteAdmin);
router.get("/customers", AdminController.getCustomers);

// Return & Exchange management
router.get('/returns', getAllReturns);
router.patch('/returns/:id/status', updateReturnStatus);
router.patch('/returns/:id/refund', markRefundStatus);
router.patch('/returns/:id/exchange-complete', markExchangeComplete);
router.patch('/returns/:id/notes', addAdminNotes);

export { router as adminRoutes }
