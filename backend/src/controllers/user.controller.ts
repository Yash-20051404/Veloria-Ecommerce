import { Request, Response } from 'express';
import { User } from '../models/User';

// Only a user's own profile fields may be edited this way — never role, email,
// isActive, passwordHash, etc. — otherwise a logged-in user could send extra
// fields in the body and escalate their own privileges.
const EDITABLE_PROFILE_FIELDS = ['name', 'full_name', 'phone', 'gender', 'date_of_birth'];

function isSelfOrAdmin(req: Request, targetUserId: string | string[]): boolean {
  // @ts-ignore - attached by the authenticate middleware
  const requester = req.user;
  if (!requester) return false;
  if (requester.role === 'ADMIN') return true;
  return requester._id?.toString() === String(targetUserId);
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to update this profile' });
    }

    const updateData: Record<string, any> = {};
    for (const field of EDITABLE_PROFILE_FIELDS) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    // Map frontend full_name to backend name schema
    if (updateData.full_name) {
      updateData.name = updateData.full_name;
      delete updateData.full_name;
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    
    const profile = {
      id: updatedUser._id,
      full_name: updatedUser.name,
      email: updatedUser.email,
      phone: (updatedUser as any).phone || '',
      gender: (updatedUser as any).gender || 'Male',
      date_of_birth: (updatedUser as any).date_of_birth || '',
      avatar_url: (updatedUser as any).avatar || '',
      membership_tier: (updatedUser as any).membership_tier || 'Silver Member',
      reward_points: (updatedUser as any).reward_points || 0,
    };

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to update this profile' });
    }

    // Assuming you are using a middleware like Multer that attaches the file to req.file
   const file = (req as any).file;

   const avatarUrl = file?.path || file?.filename || "dummy_avatar_url"; 
    
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    
    res.status(200).json({ 
      success: true, 
      message: 'Avatar uploaded', 
      data: {
        ...updatedUser.toObject(),
        avatar_url: avatarUrl 
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!isSelfOrAdmin(req, userId)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this account' });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};