import { Plus, Trash2 } from 'lucide-react'

const inputClass =
  'w-full rounded-md border border-line bg-panel-2 px-3 py-2 text-sm text-paper outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20'

export function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <input {...props} className={inputClass} />
    </label>
  )
}

export function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <select {...props} className={inputClass}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function TextArea({ label, rows = 3, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      <textarea rows={rows} {...props} className={inputClass} />
    </label>
  )
}

/** A removable card wrapping one item in a repeating list (experience entry, project, etc). */
export function ItemCard({ children, onRemove, title }) {
  return (
    <div className="relative space-y-3 rounded-lg border border-line bg-panel p-4 transition-colors hover:border-line/80">
      {title && (
        <div className="truncate pr-8 font-mono text-xs uppercase tracking-widest text-gold-soft">{title}</div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted transition-colors hover:bg-panel-2 hover:text-red-400"
        >
          <Trash2 size={15} />
        </button>
      )}
      {children}
    </div>
  )
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-line px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-gold hover:text-gold"
    >
      <Plus size={15} /> {children}
    </button>
  )
}

/** Comma-separated list editor (for tags/stack/highlights/bullets arrays of plain strings). */
export function ListField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label} (comma-separated)</span>
      <textarea
        rows={2}
        value={(value || []).join(', ')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  )
}

/** One-item-per-line editor — for arrays of full sentences (bullets/highlights) where commas appear inside items. */
export function LinesField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label} (one per line)</span>
      <textarea
        rows={rows}
        value={(value || []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
        className={inputClass}
      />
    </label>
  )
}

export function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-paper">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
  )
}
