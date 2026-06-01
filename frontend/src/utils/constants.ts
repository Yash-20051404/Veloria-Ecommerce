import { USER_ROLES, type UserRole } from '@/types/roles'

export const ROLE_ROUTES: Record<UserRole, string> = {
  [USER_ROLES.BUYER]: '/buyer',
  [USER_ROLES.SELLER]: '/seller',
  [USER_ROLES.ADMIN]: '/admin',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.BUYER]: 'Buyer',
  [USER_ROLES.SELLER]: 'Seller',
  [USER_ROLES.ADMIN]: 'Admin',
}
