import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, BellOff, Radio } from 'lucide-react'
import { apiFetch } from '../../lib/apiClient'
import { SectionHeader } from '../fields'

const POLL_MS = 6000

function timeAgo(iso) {
  const date = new Date(iso.replace(' ', 'T') + 'Z')
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

function browserFromUA(ua = '') {
  if (/edg/i.test(ua)) return 'Edge'
  if (/chrome/i.test(ua)) return 'Chrome'
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/firefox/i.test(ua)) return 'Firefox'
  return 'A visitor'
}

export default function VisitorsSection() {
  const [visits, setVisits] = useState([])
  const [total, setTotal] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const lastIdRef = useRef(0)

  const poll = async (initial = false) => {
    try {
      const params = !initial && lastIdRef.current ? `?since_id=${lastIdRef.current}` : ''
      const res = await apiFetch(`/api/visits.php${params}`)
      setTotal(res.total)
      setTodayCount(res.today_count)

      if (res.visits.length) {
        lastIdRef.current = Math.max(lastIdRef.current, ...res.visits.map((v) => v.id))
        setVisits((prev) => {
          const merged = initial ? res.visits : [...res.visits, ...prev]
          return merged.slice(0, 50)
        })

        if (!initial && notifPermission === 'granted') {
          const latest = res.visits[0]
          new Notification('New visitor on your portfolio', {
            body: `${browserFromUA(latest.user_agent)} just viewed ${latest.path}`,
            tag: 'visit-' + latest.id,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    poll(true)
    const interval = setInterval(() => poll(false), POLL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifPermission])

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }

  return (
    <div>
      <SectionHeader
        title="Visitors"
        description="Live feed of hits on the public site — updates automatically while this tab stays open."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="font-mono text-2xl font-bold text-gold">{total}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">All-time visits</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="font-mono text-2xl font-bold text-gold">{todayCount}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted">Today</div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-line bg-panel p-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-gold-soft">
              <Radio size={13} className="animate-pulse" /> Live
            </div>
            <div className="mt-1 text-xs text-muted">Polling every {POLL_MS / 1000}s</div>
          </div>
          {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
            <button
              onClick={requestPermission}
              className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted hover:border-gold hover:text-gold"
            >
              <Bell size={12} /> Enable alerts
            </button>
          )}
          {notifPermission === 'granted' && (
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-gold-soft">
              <Bell size={12} /> Alerts on
            </span>
          )}
          {notifPermission === 'denied' && (
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted">
              <BellOff size={12} /> Blocked
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-muted">No visits recorded yet.</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {visits.map((v) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-3 rounded-lg border border-line bg-panel px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-paper">
                    {v.path} <span className="text-muted">· {browserFromUA(v.user_agent)}</span>
                  </div>
                  {v.referrer && (
                    <div className="truncate font-mono text-[11px] text-muted">from {v.referrer}</div>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[11px] text-muted">{timeAgo(v.created_at)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
