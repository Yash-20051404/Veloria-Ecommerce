import { createContext } from 'react'
import { type UserRole } from '@/types/roles'

export interface AuthContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
