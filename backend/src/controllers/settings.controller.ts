import { Request, Response, NextFunction } from 'express';
import { Settings } from '../models/Settings';

export class SettingsController {
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({});
      }
      res.status(200).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      // Using findOneAndUpdate with upsert:true to ensure only one settings document ever exists
      const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
      res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings });
    } catch (error) {
      next(error);
    }
  }
}