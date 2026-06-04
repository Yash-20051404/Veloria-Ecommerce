import { Router } from 'express';
import { updateProfile, uploadAvatar, updatePreferences, deleteAccount } from '../controllers/user.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Uncomment the authMiddleware lines if your backend requires a valid JWT token
// router.use(authMiddleware);

router.put('/:id', updateProfile);

router.post('/:id/avatar', uploadAvatar); // Add multer middleware here if handling real file uploads

router.put('/:id/preferences', updatePreferences);

router.delete('/:id', deleteAccount);

export default router;