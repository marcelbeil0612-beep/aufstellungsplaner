import type { Phase } from '../lib/phaseShift'
import { useProGuard } from '../lib/proAccess'
import { useLineupStore } from '../store/useLineupStore'

type Option = {
  value: Phase
  label: string
  /** kurze Variante für schmale Screens */
  shortLabel: string
  icon: string
  hint: string
}

const options: Option[] = [
  { value: 'withBall',    label: 'Mit Ball',        shortLabel: 'Mit',    icon: '⚽', hint: 'Offensiv-Positionierung' },
  { value: 'withoutBall', label: 'Gegen den Ball',  shortLabel: 'Gegen',  icon: '🛡', hint: 'Defensiv-Positionierung' },
]

export function PhaseToggle() {
  const phase = useLineupStore((s) => s.phase)
  const setPhase = useLineupStore((s) => s.setPhase)
  const { allowed: withoutBallAllowed, guard } = useProGuard('phase-without-ball')

  return (
    <div
      role="radiogroup"
      aria-label="Taktische Phase"
      className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 p-1 shadow-inner backdrop-blur"
    >
      {options.map((opt) => {
        const active = phase === opt.value
        const locked = opt.value === 'withoutBall' && !withoutBallAllowed
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() =>
              opt.value === 'withoutBall'
                ? guard(() => setPhase('withoutBall'))
                : setPhase(opt.value)
            }
            title={locked ? `${opt.hint} · Pro` : opt.hint}
            className={[
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm',
              active
                ? opt.value === 'withBall'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-sky-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white',
            ].join(' ')}
          >
            <span aria-hidden className="text-sm sm:text-base">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
            <span className="sm:hidden">{opt.shortLabel}</span>
            {locked && <span aria-hidden className="text-[10px] opacity-70">🔒</span>}
          </button>
        )
      })}
    </div>
  )
}
