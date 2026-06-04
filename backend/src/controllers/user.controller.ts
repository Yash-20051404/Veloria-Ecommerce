import { Request, Response } from 'express';
import { User } from '../models/User'; 

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };
    
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
    // Assuming you are using a middleware like Multer that attaches the file to req.file
    const avatarUrl = req.file?.path || req.file?.filename || 'dummy_avatar_url'; 
    
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

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { preferences } = req.body;
    
    await User.findByIdAndUpdate(userId, { preferences }, { new: true });
    
    res.status(200).json({ success: true, message: 'Preferences updated', data: preferences });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};