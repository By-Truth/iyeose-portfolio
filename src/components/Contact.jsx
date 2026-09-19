import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, FileDown, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { apiFetch, isApiConfigured } from '../lib/apiClient'
import { GithubIcon, LinkedinIcon } from './icons'

function CopyableCard({ icon, label, value, href, copyValue }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable — silently ignore, the link still works.
    }
  }

  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-line bg-panel p-5 text-left transition-colors hover:border-gold/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-gold">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</div>
        <a href={href} className="block truncate text-sm font-medium text-paper hover:text-gold-soft">
          {value}
        </a>
      </div>
      {copyValue && (
        <button
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="shrink-0 rounded-md border border-line p-2 text-muted transition-colors hover:border-gold hover:text-gold"
        >
          {copied ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
        </button>
      )}
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  if (!isApiConfigured) return null

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState('sending')
    setErrorMsg('')
    try {
      await apiFetch('/api/messages.php', { method: 'POST', body: JSON.stringify(form) })
      setState('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setState('error')
      setErrorMsg(err.message)
    }
  }

  if (state === 'sent') {
    return (
      <div className="mt-10 rounded-xl border border-gold/30 bg-panel p-6 text-sm text-gold-soft">
        Thanks — your message is in. I'll get back to you soon.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Your name"
          value={form.name}
          onChange={handleChange('name')}
          className="rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
        />
        <input
          type="email"
          required
          placeholder="Your email"
          value={form.email}
          onChange={handleChange('email')}
          className="rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
        />
      </div>
      <textarea
        required
        rows={4}
        placeholder="What would you like to say?"
        value={form.message}
        onChange={handleChange('message')}
        className="w-full rounded-md border border-line bg-panel-2 px-3 py-2.5 text-sm text-paper outline-none focus:border-gold"
      />
      {state === 'error' && <p className="text-sm text-red-400">Couldn't send that — {errorMsg}</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        <Send size={16} />
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export default function Contact() {
  const { profile } = useSiteContent()

  const cards = [
    {
      icon: <Mail size={18} />,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      copyValue: profile.email,
    },
    profile.phone && {
      icon: <Phone size={18} />,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
      copyValue: profile.phone,
    },
    {
      icon: <MapPin size={18} />,
      label: 'Location',
      value: profile.location,
      href: '#top',
    },
  ].filter(Boolean)

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-24">
      <div className="blueprint-grid-fine pointer-events-none absolute inset-0 mask-fade-b opacity-60" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-gold">05 — Contact</div>
          <h2 className="text-balance text-3xl font-extrabold text-paper sm:text-4xl">
            Let's build something with data.
          </h2>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-panel px-4 py-1.5 font-mono text-xs text-gold-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {profile.availability}
          </div>

          <p className="mx-auto mt-4 max-w-lg text-muted">
            Send a message below, reach out directly, connect on LinkedIn, or take a look at the code behind
            everything on this page.
          </p>

          <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cards.length % 2 !== 0 && i === cards.length - 1 ? 'sm:col-span-2' : ''}
              >
                <CopyableCard {...c} />
              </motion.div>
            ))}
          </div>

          <ContactForm />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md bg-gold px-6 py-3 font-mono text-sm font-semibold uppercase tracking-widest text-ink transition-transform hover:-translate-y-0.5"
            >
              <LinkedinIcon size={18} />
              Connect on LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md border border-line px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold"
            >
              <GithubIcon size={18} />
              View GitHub
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-md border border-line px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold"
              >
                <FileDown size={18} />
                Download CV
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
