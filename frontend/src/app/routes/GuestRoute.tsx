import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { USER_ROLES } from '@/types/roles'

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    // Redirect logged-in users to their respective dashboards based on role
    switch (role) {
      case USER_ROLES.SELLER:
        return <Navigate to="/seller" replace state={{ from: location }} />
      case USER_ROLES.ADMIN:
        return <Navigate to="/admin" replace state={{ from: location }} />
      case USER_ROLES.BUYER:
      default:
        return <Navigate to="/buyer" replace state={{ from: location }} />
    }
  }

  return <>{children}</>
}