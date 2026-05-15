import { useEffect, useMemo, useState } from 'react'
import {
  findEntry,
  formationIdToSystemId,
  systemLabels,
  systemOrder,
  type SystemId,
} from '../../data/tacticBook'
import { useEscapeKey } from '../../lib/useEscapeKey'
import { useLineupStore } from '../../store/useLineupStore'
import { DuelDetail } from './DuelDetail'
import { SystemNav } from './SystemNav'

type Props = {
  open: boolean
  onClose: () => void
}

export function TacticBookDialog({ open, onClose }: Props) {
  const formationId = useLineupStore((s) => s.formationId)
  const lastViewed = useLineupStore((s) => s.lastViewedDuel)
  const setLastViewed = useLineupStore((s) => s.setLastViewedDuel)

  // Bei Öffnen: unser System aus aktueller Formation übernehmen, sofern nichts
  // Besseres gespeichert ist. Gegner aus lastViewed.
  const initialOur = useMemo<SystemId>(
    () => (lastViewed?.our ?? formationIdToSystemId(formationId)),
    [lastViewed, formationId],
  )
  const [ourSystem, setOurSystem] = useState<SystemId>(initialOur)
  const [opponent, setOpponent] = useState<SystemId | null>(lastViewed?.opp ?? null)

  // Beim erneuten Öffnen den gespeicherten Zustand laden
  useEffect(() => {
    if (!open) return
    setOurSystem(lastViewed?.our ?? formationIdToSystemId(formationId))
    setOpponent(lastViewed?.opp ?? null)
  }, [open, lastViewed, formationId])

  // ESC schließt
  useEscapeKey(open, onClose)

  // Auswahl persistieren, sobald ein sinnvoller Stand da ist
  useEffect(() => {
    if (!open || !opponent) return
    setLastViewed({ our: ourSystem, opp: opponent })
  }, [open, ourSystem, opponent, setLastViewed])

  // Bei Wechsel "unser System" Gegner zurücksetzen, wenn das bisherige Duell nicht existiert
  const handleOurChange = (s: SystemId) => {
    setOurSystem(s)
    if (opponent && !findEntry(s, opponent)) setOpponent(null)
  }

  const handleOppChange = (s: SystemId) => {
    if (!findEntry(ourSystem, s)) return
    setOpponent(s)
  }

  const currentEntry = opponent ? findEntry(ourSystem, opponent) : null
  const filledCount = systemOrder.filter((o) => findEntry(ourSystem, o)).length

  if (!open) return null

  // Mobile-Flow: wenn kein Opponent gewählt, zeigen wir die Navigation.
  // Sobald ein Opponent aktiv ist, zeigen wir das Detail mit Zurück-Button.
  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Systembuch"
    >
      <div
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-slate-950 shadow-2xl sm:my-4 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl sm:border sm:border-slate-800"
        onClick={(e) => e.stopPropagation()}
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)',
        }}
      >
        {/* Kopfzeile */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {opponent && (
              <button
                onClick={() => setOpponent(null)}
                className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800 lg:hidden"
                aria-label="Zurück zur Auswahl"
              >
                ← Auswahl
              </button>
            )}
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <span aria-hidden>📖</span> Systembuch
              </h2>
              <p className="text-[11px] text-slate-500">
                Unser {systemLabels[ourSystem]} · {filledCount}/{systemOrder.length} Duelle erfasst
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="-m-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Inhalt: zwei Spalten ab lg, gestackt darunter */}
        <div className="flex flex-1 overflow-hidden">
          <aside
            className={[
              'w-full shrink-0 border-slate-800 bg-slate-950/70 px-4 py-4 sm:px-6 lg:w-[280px] lg:border-r',
              opponent ? 'hidden lg:block' : 'block',
            ].join(' ')}
          >
            <SystemNav
              ourSystem={ourSystem}
              onOurSystemChange={handleOurChange}
              opponent={opponent}
              onOpponentChange={handleOppChange}
            />
          </aside>
          <main
            className={[
              'flex-1 overflow-hidden bg-slate-950 px-4 py-4 sm:px-6',
              opponent ? 'block' : 'hidden lg:block',
            ].join(' ')}
          >
            <DuelDetail
              ourSystem={ourSystem}
              opponentSystem={opponent}
              entry={currentEntry}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
