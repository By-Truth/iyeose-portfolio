import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import SectionHeading from './SectionHeading'

export default function Skills() {
  const { skillGroups, education } = useSiteContent()
  return (
    <section id="skills" className="relative border-t border-line bg-panel/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading kicker="04 — Skills & Education" title="Toolkit" />

        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-xl border border-line bg-panel p-5"
              >
                <div className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-soft">
                  {g.label}
                </div>
                <div className="space-y-3">
                  {g.items.map((s, idx) => (
                    <SkillBar key={s.name} skill={s} delay={i * 0.06 + idx * 0.05} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-soft">Education</div>
            {education.map((e) => (
              <div key={e.school} className="rounded-xl border border-gold/30 bg-panel p-6">
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 shrink-0 text-gold" size={22} />
                  <div>
                    <div className="font-bold text-paper">{e.credential}</div>
                    <div className="font-mono text-sm text-gold-soft">{e.school}</div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">
                      {e.period}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">{e.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SkillBar({ skill, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs text-paper/85">{skill.name}</span>
        <span className="font-mono text-[10px] text-muted">{skill.level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="h-full rounded-full bg-gold"
        />
      </div>
    </div>
  )
}
