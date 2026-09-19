import { motion } from 'framer-motion'
import { useSiteContent } from '../context/SiteContentContext'
import SectionHeading from './SectionHeading'
import CountUp from './CountUp'

export default function About() {
  const { profile, stats } = useSiteContent()
  return (
    <section id="about" className="relative border-t border-line py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading kicker="01 — About" title="From blueprints to pipelines" />

        <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-[15px] leading-relaxed text-muted"
          >
            {profile.about.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <blockquote className="mt-8 border-l-2 border-gold pl-5 font-mono text-base italic text-gold-soft">
              “{profile.pivotQuote}”
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="rounded-lg border border-line bg-panel p-5 transition-colors hover:border-gold/40"
                >
                  <div className="font-mono text-2xl font-bold text-gold sm:text-3xl">
                    <CountUp value={s.value} />
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-line bg-panel-2 p-5">
              <div className="mb-3 font-mono text-xs uppercase tracking-widest text-gold-soft">Top Skills</div>
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-line px-3 py-1 text-xs text-paper"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
