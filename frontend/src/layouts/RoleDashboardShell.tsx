import type { PropsWithChildren } from 'react'
import { type UserRole } from '@/types/roles'

interface RoleDashboardShellProps {
  role: UserRole
}

export function RoleDashboardShell({ role, children }: PropsWithChildren<RoleDashboardShellProps>) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="w-full min-h-screen">
        {children}
      </div>
    </div>
  )
}
