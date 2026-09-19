import { Field, TextArea, ListField, LinesField, Select, ItemCard, AddButton, SectionHeader } from '../fields'
import ImageUploadField from '../ImageUploadField'

// Keep in sync with ICONS in components/Projects.jsx.
const ICON_OPTIONS = ['sentiment', 'wastewater', 'churn', 'thermal', 'building', 'health', 'retail']

const BLANK = {
  title: '',
  period: '',
  image: '',
  icon: ICON_OPTIONS[0],
  description: '',
  highlights: [],
  stack: [],
  link: '',
}

export default function ProjectsSection({ value, onChange }) {
  const items = value || []

  const update = (i, key) => (e) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: e.target.value }
    onChange(next)
  }
  const updateList = (i, key) => (list) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: list }
    onChange(next)
  }
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([{ ...BLANK }, ...items])
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div>
      <SectionHeader
        title="Projects"
        description="Cards in the Selected Work section. Upload a screenshot per project, or leave it blank to show the themed icon tile instead."
      />
      <div className="mb-4">
        <AddButton onClick={add}>Add project</AddButton>
      </div>
      <div className="space-y-4">
        {items.map((p, i) => (
          <ItemCard key={i} title={p.title || 'New project'} onRemove={() => remove(i)}>
            <div className="flex justify-end gap-2 text-xs text-muted">
              <button type="button" onClick={() => move(i, -1)} className="hover:text-gold">
                ↑ Move up
              </button>
              <button type="button" onClick={() => move(i, 1)} className="hover:text-gold">
                ↓ Move down
              </button>
            </div>
            <ImageUploadField
              label="Screenshot"
              value={p.image}
              onChange={(url) => {
                const next = [...items]
                next[i] = { ...next[i], image: url }
                onChange(next)
              }}
              hint="Shown as the card thumbnail. Falls back to the icon tile below when empty."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" value={p.title} onChange={update(i, 'title')} />
              <Field label="Period / tag line" value={p.period} onChange={update(i, 'period')} />
              <Select label="Fallback icon" options={ICON_OPTIONS} value={p.icon} onChange={update(i, 'icon')} />
              <Field label="GitHub link" value={p.link} onChange={update(i, 'link')} />
            </div>
            <TextArea label="Description" rows={4} value={p.description} onChange={update(i, 'description')} />
            <LinesField label="Highlights" value={p.highlights} onChange={updateList(i, 'highlights')} rows={4} />
            <ListField label="Stack" value={p.stack} onChange={updateList(i, 'stack')} />
          </ItemCard>
        ))}
      </div>
    </div>
  )
}
