import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, isApiConfigured } from '../lib/apiClient'
import * as staticContent from '../data'

// The static exports from data.js double as the shape reference AND the
// offline fallback — the site renders identically to before if the backend
// isn't configured yet, or if the fetch fails for any reason.
const defaultContent = {
  profile: staticContent.profile,
  siteConfig: staticContent.siteConfig,
  stats: staticContent.stats,
  experience: staticContent.experience,
  education: staticContent.education,
  projects: staticContent.projects,
  skillGroups: staticContent.skillGroups,
}

const SiteContentContext = createContext({
  content: defaultContent,
  defaultContent,
  loading: false,
  isLive: false,
  refresh: () => {},
  saveContent: async () => {
    throw new Error('Backend not configured')
  },
})

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(isApiConfigured)
  const [isLive, setIsLive] = useState(false)

  const fetchContent = useCallback(async () => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch('/api/content.php')
      if (res?.data) {
        // Merge over defaults so a partially-filled row (or a field added to
        // data.js after the DB was seeded) never leaves a section blank.
        setContent({ ...defaultContent, ...res.data })
        setIsLive(true)
      } else {
        setContent(defaultContent)
        setIsLive(false)
      }
    } catch {
      setContent(defaultContent)
      setIsLive(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const saveContent = useCallback(async (next) => {
    await apiFetch('/api/content.php', { method: 'POST', body: JSON.stringify({ data: next }) })
    setContent(next)
    setIsLive(true)
  }, [])

  const value = useMemo(
    () => ({ content, defaultContent, loading, isLive, refresh: fetchContent, saveContent }),
    [content, loading, isLive, fetchContent, saveContent]
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

/** Returns the live (or fallback) site content: { profile, siteConfig, stats, experience, education, projects, skillGroups }. */
export function useSiteContent() {
  return useContext(SiteContentContext).content
}

/** Full context access for the admin panel: { content, defaultContent, loading, isLive, refresh, saveContent }. */
export function useSiteContentAdmin() {
  return useContext(SiteContentContext)
}
