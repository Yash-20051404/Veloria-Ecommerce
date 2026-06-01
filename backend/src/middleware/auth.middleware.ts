import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/config/env'
import { UserRole } from '@/types/roles'

export interface AuthPayload {
  sub: string
  role: UserRole
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthPayload
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload
    req.auth = payload
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}
