import type { PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import { AuthContext } from '@/store/context/AuthContext'
import { USER_ROLES, type UserRole } from '@/types/roles'

export function AppProviders({ children }: PropsWithChildren) {
  const [role, setRole] = useState<UserRole>(USER_ROLES.BUYER)

  const contextValue = useMemo(
    () => ({
      role,
      setRole,
    }),
    [role],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
