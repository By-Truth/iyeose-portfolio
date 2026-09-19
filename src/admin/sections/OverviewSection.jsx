import { useEffect, useState } from 'react'
import { Briefcase, FolderKanban, GraduationCap, Mail, Radio, Wrench } from 'lucide-react'
import { apiFetch } from '../../lib/apiClient'

const TILES = [
  { key: 'experience', label: 'Experience entries', icon: Briefcase },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'education', label: 'Education entries', icon: GraduationCap },
  { key: 'skillGroups', label: 'Skill groups', icon: Wrench },
]

export default function OverviewSection({ content, name, onNavigate }) {
  const [unread, setUnread] = useState(null)
  const [visitsToday, setVisitsToday] = useState(null)

  useEffect(() => {
    apiFetch('/api/messages.php')
      .then((res) => setUnread((res.messages || []).filter((m) => !m.is_read).length))
      .catch(() => setUnread(null))
    apiFetch('/api/visits.php')
      .then((res) => setVisitsToday(res.today_count))
      .catch(() => setVisitsToday(null))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-paper">Welcome back{name ? `, ${name}` : ''}.</h2>
        <p className="mt-1 text-sm text-muted">Here's what's on the site right now.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.icon
          const count = content[t.key]?.length ?? 0
          return (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key === 'skillGroups' ? 'skills' : t.key)}
              className="flex items-center gap-4 rounded-xl border border-line bg-panel p-5 text-left transition-colors hover:border-gold/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-gold">
                <Icon size={20} />
              </span>
              <div>
                <div className="font-mono text-2xl font-bold text-paper">{count}</div>
                <div className="text-xs uppercase tracking-wide text-muted">{t.label}</div>
              </div>
            </button>
          )
        })}

        <button
          onClick={() => onNavigate('messages')}
          className="flex items-center gap-4 rounded-xl border border-line bg-panel p-5 text-left transition-colors hover:border-gold/40"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-panel-2 text-gold">
            <Mail size={20} />
          </span>
          <div>
            <div className="font-mono text-2xl font-bold text-paper">{unread ?? '—'}</div>
            <div className="text-xs uppercase tracking-wide text-muted">Unread messages</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('visitors')}
          className="flex items-center gap-4 rounded-xl border border-line bg-panel p-5 text-left transition-colors hover:border-gold/40"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-panel-2 text-gold">
            <Radio size={20} />
          </span>
          <div>
            <div className="font-mono text-2xl font-bold text-paper">{visitsToday ?? '—'}</div>
            <div className="text-xs uppercase tracking-wide text-muted">Visits today</div>
          </div>
        </button>
      </div>
    </div>
  )
}
