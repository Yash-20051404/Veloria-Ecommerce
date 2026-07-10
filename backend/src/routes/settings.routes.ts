import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../services/auth.middleware';
import { requireRole } from '../services/rbac.middleware';
import { Role } from '../types';

const router = Router();

router.use(authenticate, requireRole(Role.ADMIN));

router.get('/', SettingsController.getSettings);
router.put('/', SettingsController.updateSettings);

export { router as settingsRoutes };