import { phaseMeta, phaseOrder, type PhaseKey } from '../../data/tacticBook'

/** Reiter-Auswahl im Duell-Detail: die vier Spielphasen + „Im Spiel". */
export type DuelTab = PhaseKey | 'coaching'

type Props = {
  value: DuelTab
  onChange: (v: DuelTab) => void
}

const COACHING_LABEL = 'Im Spiel'
const COACHING_ICON = '📣'

/**
 * Echter Tab-Selektor (kein Filter): genau ein Reiter ist aktiv. Die vier
 * Spielphasen plus ein abschließender „Im Spiel"-Reiter, der Live-Coaching
 * und mögliche Ingame-Anpassung bündelt. Eine frühere „Alles"-Option gibt es
 * bewusst nicht mehr (war nur redundant zu den Einzelphasen).
 */
export function DuelTabs({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5">
      {phaseOrder.map((key) => {
        const meta = phaseMeta[key]
        const active = value === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
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
      <button
        onClick={() => onChange('coaching')}
        title="Live-Coaching & mögliche Ingame-Anpassung"
        className={[
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
          value === 'coaching'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-white',
        ].join(' ')}
      >
        <span aria-hidden>{COACHING_ICON}</span>
        <span>{COACHING_LABEL}</span>
      </button>
    </div>
  )
}
