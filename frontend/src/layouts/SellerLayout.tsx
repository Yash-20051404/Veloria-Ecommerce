import { Outlet } from 'react-router-dom'
import { RoleDashboardShell } from '@/layouts/RoleDashboardShell'
import { USER_ROLES } from '@/types/roles'

export function SellerLayout() {
  return (
    <RoleDashboardShell role={USER_ROLES.SELLER}>
      <Outlet />
    </RoleDashboardShell>
  )
}
