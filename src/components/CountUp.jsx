import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Animates a stat value like "3.6M+" or "5+" counting up from 0 when it
 * scrolls into view. Falls back to rendering the raw string statically for
 * values with no leading number (e.g. "Distinction").
 */
export default function CountUp({ value, duration = 1.4 }) {
  const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(value)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(match ? '0' + match[2] : value)

  useEffect(() => {
    if (!inView) return
    const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(value)
    if (!m) return
    const target = parseFloat(m[1])
    const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0
    const suffix = m[2]
    const start = performance.now()

    let frame
    const tick = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = (target * eased).toFixed(decimals)
      setDisplay(current + suffix)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return <span ref={ref}>{display}</span>
}
