import {
  HEIGHT_MAX,
  HEIGHT_MIN,
  PRESSING_PRESETS,
  WIDTH_MAX,
  WIDTH_MIN,
  type PressingHeight,
} from '../lib/phaseShift'
import { useLineupStore } from '../store/useLineupStore'

const pct = (v: number) => `${Math.round(v * 100)}%`

// Auf Modulebene definiert (stabile Komponenten-Identität) – sonst
// remountet React das <input> bei jeder Wertänderung und der Drag bricht ab.
function Slider({
  label,
  value,
  min,
  max,
  ariaSuffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  ariaSuffix: string
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-3 text-xs text-slate-300">
      <span className="w-12 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} (${ariaSuffix})`}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-emerald-500"
      />
      <span className="w-9 shrink-0 text-right tabular-nums text-slate-400">{pct(value)}</span>
    </label>
  )
}

/**
 * Form-Regler je Phase. Mit Ball: nur Breite (Vertikal-Staffelung ist
 * fest & offensiv). Gegen den Ball: Breite + Höhe (Pressinghöhe) inkl.
 * drei Presets. Der Phasen-Switch wechselt die Ausrichtung.
 */
export function FormationShapeControls() {
  const phase = useLineupStore((s) => s.phase)
  const shape = useLineupStore((s) => s.phaseShape[phase])
  const setPhaseShape = useLineupStore((s) => s.setPhaseShape)
  const defensive = phase === 'withoutBall'
  const ariaSuffix = defensive ? 'Gegen den Ball' : 'Mit Ball'

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Form · {ariaSuffix}
        </span>
        <span className="text-[10px] text-slate-500">
          {defensive ? 'defensive Ausrichtung' : 'offensive Ausrichtung'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Slider
          label="Breite"
          value={shape.width}
          min={WIDTH_MIN}
          max={WIDTH_MAX}
          ariaSuffix={ariaSuffix}
          onChange={(v) => setPhaseShape(phase, { width: v })}
        />
        {defensive ? (
          <Slider
            label="Höhe"
            value={shape.height}
            min={HEIGHT_MIN}
            max={HEIGHT_MAX}
            ariaSuffix={ariaSuffix}
            onChange={(v) => setPhaseShape('withoutBall', { height: v })}
          />
        ) : (
          <p className="text-[10px] text-slate-500">
            Mit Ball zählt die Breite – die offensive Vertikal-Staffelung ist
            fest. Die Höhe stellst du defensiv ein.
          </p>
        )}
      </div>

      {defensive && (
        <div className="mt-2.5 border-t border-slate-800 pt-2">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Pressinghöhe
          </span>
          <div className="flex gap-1.5">
            {(Object.keys(PRESSING_PRESETS) as PressingHeight[]).map((key) => {
              const preset = PRESSING_PRESETS[key]
              const active = Math.abs(shape.height - preset.height) < 0.02
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPhaseShape('withoutBall', { height: preset.height })}
                  className={[
                    'flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition',
                    active
                      ? 'bg-amber-500 text-slate-950'
                      : 'border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800',
                  ].join(' ')}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
