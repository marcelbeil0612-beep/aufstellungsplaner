import type { DuelRating, SystemId } from '../../data/tacticBook'
import { findEntry, systemLabels, systemOrder } from '../../data/tacticBook'

type Props = {
  ourSystem: SystemId
  onOurSystemChange: (s: SystemId) => void
  opponent: SystemId | null
  onOpponentChange: (s: SystemId) => void
}

const ratingDot: Record<DuelRating, string> = {
  vorteilhaft:  'bg-emerald-500',
  ausgeglichen: 'bg-amber-500',
  unangenehm:   'bg-rose-500',
}
const ratingLabel: Record<DuelRating, string> = {
  vorteilhaft:  'vorteilhaft',
  ausgeglichen: 'ausgeglichen',
  unangenehm:   'unangenehm',
}

export function SystemNav({ ourSystem, onOurSystemChange, opponent, onOpponentChange }: Props) {
  return (
    <nav className="flex h-full flex-col gap-3 overflow-hidden">
      <label className="block text-xs text-slate-400">
        <span className="mb-1 block font-semibold uppercase tracking-wide text-slate-500">
          Unser System
        </span>
        <select
          value={ourSystem}
          onChange={(e) => onOurSystemChange(e.target.value as SystemId)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white shadow-inner focus:border-emerald-400 focus:outline-none"
          style={{ fontSize: '16px' }}
        >
          {systemOrder.map((s) => (
            <option key={s} value={s}>
              {systemLabels[s]}
            </option>
          ))}
        </select>
      </label>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Gegner-System
        </div>
        <ul className="space-y-1">
          {systemOrder.map((opp) => {
            const entry = findEntry(ourSystem, opp)
            const isActive = opp === opponent
            const isSelf = opp === ourSystem
            return (
              <li key={opp}>
                <button
                  onClick={() => onOpponentChange(opp)}
                  disabled={!entry}
                  className={[
                    'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition',
                    isActive
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : entry
                      ? 'border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-900 bg-slate-950/40 text-slate-600',
                    isSelf ? 'italic' : '',
                  ].join(' ')}
                  title={
                    entry
                      ? `${systemLabels[opp]} – ${ratingLabel[entry.rating]}`
                      : 'Noch nicht erfasst'
                  }
                >
                  <span
                    aria-hidden
                    className={[
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      entry ? ratingDot[entry.rating] : 'bg-slate-700',
                    ].join(' ')}
                  />
                  <span className="flex-1 truncate font-medium">{systemLabels[opp]}</span>
                  {!entry && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-600">
                      offen
                    </span>
                  )}
                  {isSelf && entry && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-500">
                      eigenes
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
