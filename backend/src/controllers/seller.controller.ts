import type { Request, Response } from 'express'

export function sellerDashboardPlaceholder(_req: Request, res: Response) {
  res.status(200).json({ message: 'Seller API scaffold ready' })
}
