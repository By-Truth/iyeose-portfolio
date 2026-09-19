import { Field, TextArea, ListField, LinesField, ItemCard, AddButton, SectionHeader } from '../fields'

const BLANK = {
  role: '',
  org: '',
  type: '',
  period: '',
  duration: '',
  location: '',
  summary: '',
  bullets: [],
  tags: [],
}

export default function ExperienceSection({ value, onChange }) {
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
      <SectionHeader title="Experience" description="Roles shown in the timeline, most recent first." />
      <div className="mb-4">
        <AddButton onClick={add}>Add role</AddButton>
      </div>
      <div className="space-y-4">
        {items.map((job, i) => (
          <ItemCard key={i} title={job.role || 'New role'} onRemove={() => remove(i)}>
            <div className="flex justify-end gap-2 text-xs text-muted">
              <button type="button" onClick={() => move(i, -1)} className="hover:text-gold">
                ↑ Move up
              </button>
              <button type="button" onClick={() => move(i, 1)} className="hover:text-gold">
                ↓ Move down
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role" value={job.role} onChange={update(i, 'role')} />
              <Field label="Organization" value={job.org} onChange={update(i, 'org')} />
              <Field label="Type (e.g. Full-time · Hybrid)" value={job.type} onChange={update(i, 'type')} />
              <Field label="Location" value={job.location} onChange={update(i, 'location')} />
              <Field label="Period (e.g. Jun 2026 — Present)" value={job.period} onChange={update(i, 'period')} />
              <Field label="Duration (e.g. 4 mos)" value={job.duration} onChange={update(i, 'duration')} />
            </div>
            <TextArea label="Summary" value={job.summary} onChange={update(i, 'summary')} />
            <LinesField label="Bullets" value={job.bullets} onChange={updateList(i, 'bullets')} rows={5} />
            <ListField label="Tags" value={job.tags} onChange={updateList(i, 'tags')} />
          </ItemCard>
        ))}
      </div>
    </div>
  )
}
