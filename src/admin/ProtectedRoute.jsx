import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiFetch, isApiConfigured, getToken, clearToken } from '../lib/apiClient'
import BackendNotConfigured from './BackendNotConfigured'

/** Gates /admin behind a valid session token; redirects to /admin/login when signed out. */
export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking') // checking | authed | anon

  useEffect(() => {
    if (!isApiConfigured) return

    if (!getToken()) {
      setStatus('anon')
      return
    }

    apiFetch('/api/auth/session.php')
      .then(() => setStatus('authed'))
      .catch(() => {
        clearToken()
        setStatus('anon')
      })
  }, [])

  if (!isApiConfigured) return <BackendNotConfigured />
  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink font-mono text-sm text-muted">
        Checking session…
      </div>
    )
  }
  if (status === 'anon') return <Navigate to="/admin/login" replace />

  return children
}
