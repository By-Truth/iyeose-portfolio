import { AlertTriangle } from 'lucide-react'

export default function BackendNotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-24 text-paper">
      <div className="max-w-lg rounded-xl border border-line bg-panel p-8">
        <div className="flex items-center gap-3 text-gold">
          <AlertTriangle size={22} />
          <h1 className="text-lg font-bold">Backend not configured</h1>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The admin panel talks to the PHP API in <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-gold-soft">/backend</code>.
          Follow <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-gold-soft">BACKEND_SETUP.md</code> in
          the project root to configure it, run the migration, create your admin login, and set{' '}
          <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-gold-soft">VITE_API_URL</code> in your{' '}
          <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-gold-soft">.env</code> file.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Until then, the public site keeps working exactly as before, reading straight from{' '}
          <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-gold-soft">src/data.js</code>.
        </p>
      </div>
    </div>
  )
}
