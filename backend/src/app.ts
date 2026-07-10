import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { apiRoutes } from '@/routes'
import { errorHandler } from '@/middleware/error.middleware'
import { notFoundHandler } from '@/middleware/notFound.middleware'

export function createApp() {
  const app = express()
  app.set('trust proxy', 1);
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://veloria-ecommerce-five.vercel.app"
  ];

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  // Cross-origin resource policy relaxed since product images are served from
  // Cloudinary (a different origin) and the frontend is on a different domain too.
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }))
  app.use(morgan('dev'))
  // 15mb covers a handful of base64-encoded product images from the admin
  // upload form; 50mb was needlessly large and an easy DoS lever.
  app.use(express.json({ limit: '15mb' }))
  app.use(express.urlencoded({ limit: '15mb', extended: true }))

  app.get('/', (_req, res) => {
    res.status(200).json({
      service: 'novakicks-api',
      version: 'v1',
      message: 'API foundation running',
    })
  })

  // Mounted once — this used to also be mounted directly at '/api/v1/orders'
  // in addition to going through apiRoutes, which was redundant.
  app.use('/api/v1', apiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
