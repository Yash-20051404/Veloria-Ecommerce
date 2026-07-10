import type { NextFunction, Request, Response } from 'express'
import { logger } from '@/utils/logger'
import { ZodError } from 'zod'
import { AppError } from '@/utils/errors'

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  // Handle Zod validation errors - return proper 400 with field errors
  if (error instanceof ZodError) {
    const fieldErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
    logger.warn(`Validation error: ${JSON.stringify(fieldErrors)}`)
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: fieldErrors
    })
  }

  // Handle known AppError instances
  if (error instanceof AppError) {
    logger.warn(`AppError ${error.statusCode}: ${error.message}`)
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    })
  }

  // Unknown errors
  logger.error(error.message)
  res.status(500).json({ success: false, message: 'Internal server error' })
}
