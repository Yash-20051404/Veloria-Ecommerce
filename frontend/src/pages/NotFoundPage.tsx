import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-3xl font-semibold">Route not found</h1>
      <p className="mt-3 text-muted-foreground">This placeholder route has not been wired yet.</p>
      <Link className="mt-6 inline-block text-cyan-500 hover:text-cyan-400" to="/">
        Return to landing page
      </Link>
    </section>
  )
}
