import { phaseMeta, phaseOrder, type PhaseKey } from '../../data/tacticBook'

type Props = {
  value: PhaseKey | null
  onChange: (v: PhaseKey | null) => void
}

/**
 * 4-Phasen-Filter (Vier-Phasen-Modell). `null` = „Alles", sonst genau eine Phase.
 * Anders als die alte Version dimmt das nicht andere Abschnitte, sondern filtert
 * die Phase-Karten in `DuelDetail` hart auf die ausgewählte Phase.
 */
export function PhaseHighlighter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5">
      <button
        onClick={() => onChange(null)}
        className={[
          'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
          value === null ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white',
        ].join(' ')}
      >
        Alles
      </button>
      {phaseOrder.map((key) => {
        const meta = phaseMeta[key]
        const active = value === key
        return (
          <button
            key={key}
            onClick={() => onChange(active ? null : key)}
            title={meta.tooltip}
            className={[
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
              active ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white',
            ].join(' ')}
          >
            <span aria-hidden>{meta.icon}</span>
            <span>{meta.label}</span>
          </button>
        )
      })}
    </div>
  )
}
