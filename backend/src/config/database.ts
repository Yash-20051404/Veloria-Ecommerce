import mongoose from 'mongoose'
import { env } from '@/config/env'
import { logger } from '@/utils/logger'

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing')
  }

  await mongoose.connect(env.mongoUri)
  logger.info('MongoDB connected')
}
