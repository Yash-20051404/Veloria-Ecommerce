import type { NextFunction, Response } from 'express'
import type { AuthenticatedRequest } from '@/middleware/auth.middleware'
import type { UserRole } from '@/types/roles'

export function requireRole(allowed: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.auth?.role

    if (!userRole || !allowed.includes(userRole)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    next()
  }
}
