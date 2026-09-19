import { Field, ItemCard, AddButton, SectionHeader } from '../fields'

export default function StatsSection({ value, onChange }) {
  const stats = value || []

  const update = (i, key) => (e) => {
    const next = [...stats]
    next[i] = { ...next[i], [key]: e.target.value }
    onChange(next)
  }
  const remove = (i) => onChange(stats.filter((_, idx) => idx !== i))
  const add = () => onChange([...stats, { value: '', label: '' }])

  return (
    <div>
      <SectionHeader
        title="Stats"
        description={'The four counters in the About section (e.g. "5+" / "Years in Architecture").'}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s, i) => (
          <ItemCard key={i} onRemove={() => remove(i)}>
            <Field label="Value" value={s.value} onChange={update(i, 'value')} />
            <Field label="Label" value={s.label} onChange={update(i, 'label')} />
          </ItemCard>
        ))}
      </div>
      <div className="mt-4">
        <AddButton onClick={add}>Add stat</AddButton>
      </div>
    </div>
  )
}
