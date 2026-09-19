import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import SectionHeading from './SectionHeading'

export default function Experience() {
  const { experience } = useSiteContent()
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.8', 'end 0.6'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <section id="experience" className="relative border-t border-line bg-panel/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          kicker="02 — Experience"
          title="A career built on two disciplines"
          description="Five years shaping the built environment, now channelled into building data systems — the throughline is structure, patterns, and solving for the people at the end of the pipeline."
        />

        <div ref={timelineRef} className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-line sm:block" />
          <motion.div
            className="absolute left-[7px] top-2 hidden w-px origin-top bg-gold sm:block"
            style={{ scaleY: lineProgress, height: 'calc(100% - 1rem)' }}
          />

          <div className="space-y-10">
            {experience.map((job, i) => (
              <motion.div
                key={job.role + job.org}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative sm:pl-10"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
                  className="absolute left-0 top-1.5 hidden h-[15px] w-[15px] rounded-full border-2 border-gold bg-ink shadow-[0_0_0_4px_rgba(184,151,95,0.12)] sm:block"
                />

                <div className="rounded-xl border border-line bg-panel p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_0_0_1px_rgba(184,151,95,0.12)] sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-paper sm:text-xl">{job.role}</h3>
                      <div className="mt-1 font-mono text-sm text-gold-soft">{job.org}</div>
                    </div>
                    <div className="text-right font-mono text-xs uppercase tracking-wide text-muted">
                      <div>{job.period}</div>
                      <div className="mt-0.5">{job.duration}</div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                    <span>{job.type}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-gold" />
                      {job.location}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{job.summary}</p>

                  <ul className="mt-4 space-y-2">
                    {job.bullets.map((b, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className="flex gap-2.5 text-sm leading-relaxed text-paper/85"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {b}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-panel-2 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
