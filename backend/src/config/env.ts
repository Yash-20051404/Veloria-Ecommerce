import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const nodeEnv = process.env.NODE_ENV ?? 'development'

// SECURITY: never fall back to a hardcoded/predictable JWT secret.
// In production this must be set explicitly or the server refuses to start.
// In dev, generate a random secret per-process so tokens are never forgeable
// with a known default, but devs still don't need to configure anything just to run it.
let jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  if (nodeEnv === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start in production without it.')
  }
  jwtSecret = crypto.randomBytes(48).toString('hex')
  // eslint-disable-next-line no-console
  console.warn('[env] JWT_SECRET not set — using a random per-process secret for this dev session. Existing tokens will be invalidated on restart. Set JWT_SECRET in your .env for stable local sessions.')
}

const razorpayKey = process.env.RAZORPAY_KEY_ID?.trim()
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET?.trim()
if (!razorpayKey || !razorpaySecret) {
  console.warn('[env] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set — any payment request will fail with an auth error from Razorpay. Set both in backend/.env (no quotes, no trailing spaces) and restart the server.')
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtSecret,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5174',
  razorpayKey: razorpayKey ?? '',
  razorpaySecret: razorpaySecret ?? '',
}
