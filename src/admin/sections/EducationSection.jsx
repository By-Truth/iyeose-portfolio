import { Field, TextArea, ItemCard, AddButton, SectionHeader } from '../fields'

const BLANK = { school: '', credential: '', period: '', detail: '' }

export default function EducationSection({ value, onChange }) {
  const items = value || []

  const update = (i, key) => (e) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: e.target.value }
    onChange(next)
  }
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, { ...BLANK }])

  return (
    <div>
      <SectionHeader title="Education" description="Degrees and credentials shown alongside Skills." />
      <div className="space-y-4">
        {items.map((e, i) => (
          <ItemCard key={i} title={e.school || 'New entry'} onRemove={() => remove(i)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="School" value={e.school} onChange={update(i, 'school')} />
              <Field label="Credential" value={e.credential} onChange={update(i, 'credential')} />
              <Field label="Period" value={e.period} onChange={update(i, 'period')} />
            </div>
            <TextArea label="Detail" value={e.detail} onChange={update(i, 'detail')} />
          </ItemCard>
        ))}
      </div>
      <div className="mt-4">
        <AddButton onClick={add}>Add education entry</AddButton>
      </div>
    </div>
  )
}
