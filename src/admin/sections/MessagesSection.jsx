import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { apiFetch } from '../../lib/apiClient'
import { SectionHeader } from '../fields'

export default function MessagesSection() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/messages.php')
      setMessages(res.messages || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleRead = async (msg) => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)))
    try {
      await apiFetch(`/api/messages.php?id=${msg.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: !msg.is_read }),
      })
    } catch {
      // Revert on failure.
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: msg.is_read } : m)))
    }
  }

  const remove = async (id) => {
    const prev = messages
    setMessages((cur) => cur.filter((m) => m.id !== id))
    try {
      await apiFetch(`/api/messages.php?id=${id}`, { method: 'DELETE' })
    } catch {
      setMessages(prev)
    }
  }

  return (
    <div>
      <SectionHeader title="Messages" description="Submissions from the Contact form on the public site." />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-muted">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-4 ${m.is_read ? 'border-line bg-panel' : 'border-gold/40 bg-panel-2'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-paper">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="font-mono text-xs text-gold-soft hover:text-gold">
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-muted">
                    {new Date(m.created_at.replace(' ', 'T') + 'Z').toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleRead(m)}
                    aria-label={m.is_read ? 'Mark unread' : 'Mark read'}
                    className="rounded-md p-1.5 text-muted hover:bg-panel-2 hover:text-gold"
                  >
                    {m.is_read ? <MailOpen size={15} /> : <Mail size={15} />}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    aria-label="Delete"
                    className="rounded-md p-1.5 text-muted hover:bg-panel-2 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-paper/85">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
