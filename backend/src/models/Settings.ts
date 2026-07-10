import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  [key: string]: any;
}

const SettingsSchema = new Schema({}, { strict: false, timestamps: true });

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);