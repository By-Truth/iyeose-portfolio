export default function SectionHeading({ kicker, title, description }) {
  return (
    <div className="mb-12 max-w-2xl">
      <div className="mb-3 font-mono text-xs uppercase tracking-widest text-gold">{kicker}</div>
      <h2 className="text-balance text-3xl font-extrabold text-paper sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted">{description}</p>}
    </div>
  )
}
