import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { apiRoutes } from '@/routes'
import { env } from '@/config/env'
import { errorHandler } from '@/middleware/error.middleware'
import { notFoundHandler } from '@/middleware/notFound.middleware'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(express.json())

  app.get('/', (_req, res) => {
    res.status(200).json({
      service: 'novakicks-api',
      version: 'v1',
      message: 'API foundation running',
    })
  })

  app.use('/api/v1', apiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
