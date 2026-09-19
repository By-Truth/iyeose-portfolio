import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Briefcase,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Radio,
  RotateCcw,
  Save,
  User,
  Wrench,
} from 'lucide-react'
import { clearToken } from '../lib/apiClient'
import { useSiteContentAdmin } from '../context/SiteContentContext'
import OverviewSection from './sections/OverviewSection'
import ProfileSection from './sections/ProfileSection'
import StatsSection from './sections/StatsSection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import MessagesSection from './sections/MessagesSection'
import VisitorsSection from './sections/VisitorsSection'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile & Site', icon: User },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'visitors', label: 'Visitors', icon: Radio },
]

const NO_SAVE_TABS = ['overview', 'messages', 'visitors']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { content, loading, saveContent, refresh } = useSiteContentAdmin()
  const [draft, setDraft] = useState(content)
  const [tab, setTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  // Sync local draft whenever the underlying content reloads (initial load, refresh, or after a save).
  useEffect(() => {
    setDraft(content)
  }, [content])

  const update = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setStatus('')
    try {
      await saveContent(draft)
      setStatus('Saved.')
    } catch (err) {
      setStatus(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(''), 4000)
    }
  }

  const handleDiscard = async () => {
    await refresh()
    setStatus('Reloaded from server.')
    setTimeout(() => setStatus(''), 2500)
  }

  const handleSignOut = () => {
    clearToken()
    navigate('/admin/login', { replace: true })
  }

  const showSaveBar = !NO_SAVE_TABS.includes(tab)
  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="blueprint-grid-fine pointer-events-none fixed inset-0 opacity-40" />

      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink/90 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-gold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/40 bg-panel text-xs font-bold">
            {activeTab?.icon ? <activeTab.icon size={14} /> : null}
          </span>
          {activeTab?.label ?? 'Admin'}
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {status && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mr-1 rounded-full border border-line bg-panel px-3 py-1.5 text-xs text-muted"
              >
                {status}
              </motion.span>
            )}
          </AnimatePresence>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold"
          >
            <ExternalLink size={14} /> View site
          </a>
          {showSaveBar && (
            <>
              <button
                onClick={handleDiscard}
                className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <RotateCcw size={14} /> Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-md bg-gold px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Save size={14} /> {saving ? 'Saving…' : 'Save changes'}
              </button>
            </>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row">
        <nav className="flex gap-1 overflow-x-auto md:w-52 md:shrink-0 md:flex-col md:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 text-left font-mono text-xs uppercase tracking-widest transition-colors ${
                  isActive ? 'text-gold' : 'text-muted hover:text-paper'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-tab-active"
                    className="absolute inset-0 rounded-md bg-panel-2"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <Icon size={15} className="relative shrink-0" />
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="min-w-0 flex-1">
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === 'overview' && (
                  <OverviewSection content={draft} name={draft.profile?.preferredName} onNavigate={setTab} />
                )}
                {tab === 'profile' && (
                  <ProfileSection
                    profile={draft.profile}
                    siteConfig={draft.siteConfig}
                    onChangeProfile={update('profile')}
                    onChangeSiteConfig={update('siteConfig')}
                  />
                )}
                {tab === 'stats' && <StatsSection value={draft.stats} onChange={update('stats')} />}
                {tab === 'experience' && (
                  <ExperienceSection value={draft.experience} onChange={update('experience')} />
                )}
                {tab === 'education' && <EducationSection value={draft.education} onChange={update('education')} />}
                {tab === 'projects' && <ProjectsSection value={draft.projects} onChange={update('projects')} />}
                {tab === 'skills' && <SkillsSection value={draft.skillGroups} onChange={update('skillGroups')} />}
                {tab === 'messages' && <MessagesSection />}
                {tab === 'visitors' && <VisitorsSection />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
