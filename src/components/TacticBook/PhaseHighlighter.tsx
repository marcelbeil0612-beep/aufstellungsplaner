import type { PhaseTab, SectionKey } from '../../data/tacticBook'

const phases: PhaseTab[] = ['Aufbau', 'Pressing', 'Ballbesitz', 'Umschalten', 'Verteidigen']

/** Mapping Phase → betonte Abschnitte. Unmarkierte bleiben sichtbar, aber leicht gedimmt. */
export const phaseSections: Record<PhaseTab, SectionKey[]> = {
  Aufbau:      ['inPossession', 'liveCoaching'],
  Pressing:    ['pressing', 'importantZones'],
  Ballbesitz:  ['inPossession', 'importantZones'],
  Umschalten:  ['transition'],
  Verteidigen: ['ourDangers', 'importantZones', 'adjustments'],
}

type Props = {
  value: PhaseTab | null
  onChange: (v: PhaseTab | null) => void
}

export function PhaseHighlighter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5">
      <button
        onClick={() => onChange(null)}
        className={[
          'rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
          value === null ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white',
        ].join(' ')}
      >
        Alles
      </button>
      {phases.map((p) => (
        <button
          key={p}
          onClick={() => onChange(value === p ? null : p)}
          className={[
            'rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
            value === p ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white',
          ].join(' ')}
        >
          {p}
        </button>
      ))}
    </div>
  )
}
