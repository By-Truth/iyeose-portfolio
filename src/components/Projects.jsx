import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Droplet,
  MessageSquare,
  ShoppingCart,
  Thermometer,
  Users,
} from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { GithubIcon } from './icons'
import SectionHeading from './SectionHeading'

const ICONS = {
  sentiment: MessageSquare,
  wastewater: Droplet,
  churn: Users,
  thermal: Thermometer,
  building: Building2,
  health: Activity,
  retail: ShoppingCart,
}

/** Repo screenshot when set, otherwise a themed icon tile — never a broken image. */
function ProjectThumb({ project }) {
  const [errored, setErrored] = useState(false)
  const Icon = ICONS[project.icon] || Building2

  if (project.image && !errored) {
    return (
      <img
        src={project.image}
        alt={project.title}
        onError={() => setErrored(true)}
        className="h-full w-full object-cover"
      />
    )
  }

  return (
    <div className="blueprint-grid-fine flex h-full w-full items-center justify-center bg-panel-2">
      <Icon size={34} className="text-gold/70" strokeWidth={1.5} />
    </div>
  )
}

function repoName(link) {
  try {
    return new URL(link).pathname.replace(/^\//, '')
  } catch {
    return link
  }
}

export default function Projects() {
  const { projects } = useSiteContent()
  return (
    <section id="projects" className="relative border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          kicker="03 — Projects"
          title="Selected work"
          description="Full write-ups, code and notebooks live on GitHub — these are the projects worth reading end to end."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-gold/50"
            >
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-line">
                <ProjectThumb project={p} />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-gold">{p.period}</div>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                  />
                </div>

                <h3 className="mt-2 text-lg font-bold leading-snug text-paper">{p.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>

                <ul className="mt-4 space-y-2">
                  {p.highlights.map((h, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="flex gap-2 text-[13px] leading-relaxed text-paper/80"
                    >
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-gold-soft" />
                      {h}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-panel-2 px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted group-hover:text-gold-soft">
                  <GithubIcon size={13} />
                  <span className="truncate">{repoName(p.link)}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://github.com/Iyeose?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm uppercase tracking-widest text-gold hover:text-gold-soft"
          >
            See all repositories on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}
