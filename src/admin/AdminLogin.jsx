import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { apiFetch, isApiConfigured, setToken } from '../lib/apiClient'
import BackendNotConfigured from './BackendNotConfigured'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!isApiConfigured) return <BackendNotConfigured />
  if (done) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch('/api/auth/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(res.token)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 text-paper">
      <div className="blueprint-grid pointer-events-none absolute inset-0 mask-fade-b opacity-60" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-xl border border-line bg-panel/95 p-8 shadow-[0_0_60px_-15px_rgba(184,151,95,0.25)] backdrop-blur"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-panel-2 text-gold">
            <LogIn size={18} />
          </span>
          <div className="font-mono text-sm uppercase tracking-widest text-gold">Admin sign in</div>
          <p className="mt-1 text-xs text-muted">Manage your portfolio's content and messages.</p>
        </div>

        <label className="block text-xs uppercase tracking-wide text-muted">Email</label>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 mt-1.5 w-full rounded-md border border-line bg-panel-2 px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
        />

        <label className="block text-xs uppercase tracking-wide text-muted">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 mt-1.5 w-full rounded-md border border-line bg-panel-2 px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gold px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </motion.form>
    </div>
  )
}
