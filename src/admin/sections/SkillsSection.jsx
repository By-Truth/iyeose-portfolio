import { Field, ItemCard, AddButton, SectionHeader } from '../fields'

export default function SkillsSection({ value, onChange }) {
  const groups = value || []

  const updateGroup = (gi, key) => (e) => {
    const next = [...groups]
    next[gi] = { ...next[gi], [key]: e.target.value }
    onChange(next)
  }
  const removeGroup = (gi) => onChange(groups.filter((_, i) => i !== gi))
  const addGroup = () => onChange([...groups, { label: 'New group', items: [] }])

  const updateItem = (gi, ii, key) => (e) => {
    const next = [...groups]
    const items = [...next[gi].items]
    const val = key === 'level' ? Number(e.target.value) : e.target.value
    items[ii] = { ...items[ii], [key]: val }
    next[gi] = { ...next[gi], items }
    onChange(next)
  }
  const removeItem = (gi, ii) => {
    const next = [...groups]
    next[gi] = { ...next[gi], items: next[gi].items.filter((_, i) => i !== ii) }
    onChange(next)
  }
  const addItem = (gi) => {
    const next = [...groups]
    next[gi] = { ...next[gi], items: [...next[gi].items, { name: '', level: 70 }] }
    onChange(next)
  }

  return (
    <div>
      <SectionHeader title="Skills" description="Grouped skill bars in the Toolkit section. Level is 0-100." />
      <div className="space-y-5">
        {groups.map((g, gi) => (
          <ItemCard key={gi} onRemove={() => removeGroup(gi)}>
            <Field label="Group label" value={g.label} onChange={updateGroup(gi, 'label')} />
            <div className="space-y-2">
              {g.items.map((it, ii) => (
                <div key={ii} className="flex items-center gap-2">
                  <input
                    value={it.name}
                    onChange={updateItem(gi, ii, 'name')}
                    placeholder="Skill name"
                    className="flex-1 rounded-md border border-line bg-panel-2 px-3 py-2 text-sm text-paper outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={it.level}
                    onChange={updateItem(gi, ii, 'level')}
                    className="w-20 rounded-md border border-line bg-panel-2 px-2 py-2 text-center text-sm text-paper outline-none focus:border-gold"
                  />
                  <span className="text-xs text-muted">%</span>
                  <button
                    type="button"
                    onClick={() => removeItem(gi, ii)}
                    className="rounded-md px-2 py-2 text-xs text-muted hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addItem(gi)}
              className="font-mono text-xs uppercase tracking-widest text-gold hover:text-gold-soft"
            >
              + Add skill
            </button>
          </ItemCard>
        ))}
      </div>
      <div className="mt-4">
        <AddButton onClick={addGroup}>Add group</AddButton>
      </div>
    </div>
  )
}
