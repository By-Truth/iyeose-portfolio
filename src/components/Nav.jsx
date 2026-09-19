import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import useTheme from '../useTheme'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const { siteConfig } = useSiteContent()
  const [theme, toggleTheme] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const logoSrc = theme === 'light' ? siteConfig.logoImageLight : siteConfig.logoImageDark

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrollspy — highlight the link for whichever section is in view.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-ink/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gold"
        style={{ scaleX: progress }}
      />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 text-paper">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-7 w-auto sm:h-8" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/40 bg-panel font-mono text-xs font-bold text-gold">
              {siteConfig.logoInitials}
            </span>
          )}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                active === l.href ? 'text-gold' : 'text-muted hover:text-gold'
              }`}
            >
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
          <a
            href="https://github.com/Iyeose"
            target="_blank"
            rel="noreferrer"
            className="ml-3 rounded-full border border-gold/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            GitHub
          </a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} className="ml-1" />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-paper"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-line bg-ink md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`font-mono text-sm uppercase tracking-widest ${
                    active === l.href ? 'text-gold' : 'text-muted hover:text-gold'
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
