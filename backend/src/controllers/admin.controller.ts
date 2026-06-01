import type { Request, Response } from 'express'

export function adminDashboardPlaceholder(_req: Request, res: Response) {
  res.status(200).json({ message: 'Admin API scaffold ready' })
}
