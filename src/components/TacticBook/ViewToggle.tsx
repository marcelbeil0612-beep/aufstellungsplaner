import type { TacticBookView } from '../../data/tacticBook'

type Option = {
  value: TacticBookView
  label: string
  shortLabel: string
  icon: string
  hint: string
}

const options: Option[] = [
  { value: 'matchday', label: 'Spieltag', shortLabel: 'Spieltag', icon: '🏃', hint: 'Kurz & knapp für die Bank' },
  { value: 'coach',    label: 'Trainer',  shortLabel: 'Trainer',  icon: '📋', hint: 'Mit Räumen, Pressing, Ballbesitz, Umschalten' },
  { value: 'training', label: 'Training', shortLabel: 'Training', icon: '🏋', hint: 'Zusätzlich Trainingsformen und typische Probleme' },
]

type Props = {
  value: TacticBookView
  onChange: (v: TacticBookView) => void
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Detailtiefe"
      className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 p-1 shadow-inner"
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            title={opt.hint}
            className={[
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm',
              active
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white',
            ].join(' ')}
          >
            <span aria-hidden>{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sm:hidden">{opt.shortLabel}</span>
          </button>
        )
      })}
    </div>
  )
}
