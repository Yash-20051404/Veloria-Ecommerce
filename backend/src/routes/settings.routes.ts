import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';

const router = Router();

router.get('/', SettingsController.getSettings);
router.put('/', SettingsController.updateSettings);

export { router as settingsRoutes };