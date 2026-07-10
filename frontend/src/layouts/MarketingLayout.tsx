import { Outlet } from 'react-router-dom'

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
