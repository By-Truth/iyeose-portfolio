import { motion } from 'framer-motion'
import { ArrowDown, MapPin, Sparkles } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { GithubIcon, LinkedinIcon } from './icons'
import Avatar from './Avatar'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Hero() {
  const { profile } = useSiteContent()
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="blueprint-grid pointer-events-none absolute inset-0 mask-fade-b" />
      <motion.div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 left-[-10%] h-[420px] w-[420px] rounded-full bg-paper/5 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={item}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-gold"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              Architect → Data Scientist
            </motion.div>

            <motion.h1
              variants={item}
              className="text-balance font-sans text-4xl font-extrabold leading-[1.08] text-paper sm:text-5xl lg:text-6xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p variants={item} className="mt-5 max-w-xl text-balance text-lg text-muted sm:text-xl">
              {profile.headline}
            </motion.p>

            <motion.p variants={item} className="mt-2 font-mono text-sm uppercase tracking-widest text-gold-soft">
              {profile.tagline}
            </motion.p>

            <motion.div variants={item} className="mt-6 flex items-center gap-2 font-mono text-sm text-muted">
              <MapPin size={16} className="text-gold" />
              {profile.location}
            </motion.div>

            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="rounded-md bg-gold px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-md border border-line px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold"
              >
                Get in Touch
              </a>
              <div className="flex items-center gap-3 pl-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-full border border-line p-2.5 text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-full border border-line p-2.5 text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <BlueprintFrame />
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-20 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-gold"
        >
          <motion.span
            className="flex items-center gap-2"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll <ArrowDown size={14} />
          </motion.span>
        </motion.a>
      </div>
    </section>
  )
}

function BlueprintFrame() {
  return (
    <div className="relative h-full w-full">
      {/* Decorative construction rings */}
      <svg viewBox="0 0 400 400" fill="none" className="absolute inset-0 h-full w-full">
        <circle cx="200" cy="200" r="188" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="150" stroke="var(--color-line)" strokeWidth="1" />
      </svg>

      {/* Photo panel with drafting-style corner brackets */}
      <div className="absolute inset-[12%] overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_0_60px_-15px_rgba(184,151,95,0.25)]">
        <Avatar />
      </div>
      <Corner className="left-[9%] top-[9%] border-l-2 border-t-2" />
      <Corner className="right-[9%] top-[9%] border-r-2 border-t-2" />
      <Corner className="bottom-[9%] left-[9%] border-b-2 border-l-2" />
      <Corner className="bottom-[9%] right-[9%] border-b-2 border-r-2" />

      {/* Floating info chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 0.9, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
        className="absolute -left-4 top-6 flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 font-mono text-[11px] text-paper shadow-lg sm:-left-8"
      >
        <Sparkles size={13} className="text-gold" />
        Data Scientist
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.1, duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } }}
        className="absolute -right-4 bottom-10 rounded-lg border border-line bg-panel px-3 py-2 font-mono text-[11px] text-paper shadow-lg sm:-right-8"
      >
        <span className="text-gold">5+</span> yrs experience
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-ink px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold-soft"
      >
        Ex-Architect
      </motion.div>
    </div>
  )
}

function Corner({ className }) {
  return <span className={`absolute h-6 w-6 border-gold/70 ${className}`} />
}
