import { Outlet } from 'react-router-dom'
import { RoleDashboardShell } from '@/layouts/RoleDashboardShell'
import { USER_ROLES } from '@/types/roles'

export function BuyerLayout() {
  return (
    <RoleDashboardShell role={USER_ROLES.BUYER}>
      <Outlet />
    </RoleDashboardShell>
  )
}
