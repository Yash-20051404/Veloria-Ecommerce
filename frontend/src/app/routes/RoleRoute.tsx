import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { type UserRole } from '@/types/roles'

interface RoleRouteProps {
  allowedRoles: UserRole[]
}

export function RoleRoute({ allowedRoles, children }: PropsWithChildren<RoleRouteProps>) {
  const location = useLocation()
  const { role } = useAuth()

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <>{children}</>
}
