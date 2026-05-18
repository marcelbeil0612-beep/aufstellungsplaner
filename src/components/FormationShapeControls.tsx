import { SHAPE_MAX, SHAPE_MIN } from '../lib/phaseShift'
import { useLineupStore } from '../store/useLineupStore'

const pct = (v: number) => `${Math.round(v * 100)}%`

/**
 * Zwei Regler (Breite/Höhe) für die aktuell gewählte Phase. Mit Ball =
 * offensive Ausrichtung, Gegen Ball = defensive – der Phasen-Switch
 * wechselt zwischen beiden gespeicherten Formen.
 */
export function FormationShapeControls() {
  const phase = useLineupStore((s) => s.phase)
  const shape = useLineupStore((s) => s.phaseShape[phase])
  const setPhaseShape = useLineupStore((s) => s.setPhaseShape)

  const sliders: Array<{ key: 'width' | 'height'; label: string }> = [
    { key: 'width', label: 'Breite' },
    { key: 'height', label: 'Höhe' },
  ]

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Form · {phase === 'withBall' ? 'Mit Ball' : 'Gegen den Ball'}
        </span>
        <span className="text-[10px] text-slate-500">
          {phase === 'withBall' ? 'offensive Ausrichtung' : 'defensive Ausrichtung'}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {sliders.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 text-xs text-slate-300">
            <span className="w-12 shrink-0">{label}</span>
            <input
              type="range"
              min={SHAPE_MIN}
              max={SHAPE_MAX}
              step={0.01}
              value={shape[key]}
              onChange={(e) => setPhaseShape(phase, { [key]: Number(e.target.value) })}
              aria-label={`${label} (${phase === 'withBall' ? 'Mit Ball' : 'Gegen den Ball'})`}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-500"
            />
            <span className="w-9 shrink-0 text-right tabular-nums text-slate-400">
              {pct(shape[key])}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
