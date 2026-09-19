import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-panel text-gold shadow-lg backdrop-blur-md hover:bg-gold hover:text-ink"
        >
          <ArrowUp size={18} />
        </motion.a>
      )}
    </AnimatePresence>
  )
}

export default function Footer() {
  const { profile } = useSiteContent()
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-mono text-xs text-muted sm:flex-row">
        <div>© {new Date().getFullYear()} {profile.name}</div>
        <div className="text-muted/70">
          Built {' '}
          <a
            href="https://bytruthltd.com/"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-gold transition-colors hover:text-gold-soft"
          >
            By Truth
          </a>
        </div>
      </div>
      <BackToTop />
    </footer>
  )
}
