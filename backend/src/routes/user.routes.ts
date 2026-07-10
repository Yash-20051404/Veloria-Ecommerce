import { Router } from 'express';
import { updateProfile, uploadAvatar, deleteAccount } from '../controllers/user.controller';
import { authenticate } from '../services/auth.middleware';

const router = Router();

router.use(authenticate);

router.put('/:id', updateProfile);

router.post('/:id/avatar', uploadAvatar); // Add multer middleware here if handling real file uploads

// router.put('/:id/preferences', updatePreferences);

router.delete('/:id', deleteAccount);

export default router;