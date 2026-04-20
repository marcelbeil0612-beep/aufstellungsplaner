import { formations } from '../data/formations'
import { useLineupStore } from '../store/useLineupStore'

export function FormationPicker() {
  const formationId = useLineupStore((s) => s.formationId)
  const setFormation = useLineupStore((s) => s.setFormation)

  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <span className="font-medium">Formation</span>
      <select
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-white shadow-inner focus:border-emerald-400 focus:outline-none"
        value={formationId}
        onChange={(e) => setFormation(e.target.value)}
      >
        {formations.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </label>
  )
}
