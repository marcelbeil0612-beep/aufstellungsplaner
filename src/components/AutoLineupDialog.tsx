import { useMemo } from 'react'
import { formationById } from '../data/formations'
import { positionShort } from '../data/positionWeights'
import { computeBestLineup } from '../lib/autoLineup'
import { initials } from '../lib/photoUtils'
import { usePlayerPhotoUrl } from '../store/photoStore'
import { useLineupStore } from '../store/useLineupStore'
import type { Player } from '../types'
import { Modal } from './Modal'

function PlayerAvatarMini({ player }: { player: Player }) {
  const photoUrl = usePlayerPhotoUrl(player)
  return (
    <div
      className={[
        'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white',
        player.role === 'GK'
          ? 'bg-gradient-to-br from-amber-500 to-amber-700'
          : 'bg-gradient-to-br from-sky-500 to-indigo-700',
      ].join(' ')}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(player.name)
      )}
    </div>
  )
}

type Props = {
  open: boolean
  onClose: () => void
}

export function AutoLineupDialog({ open, onClose }: Props) {
  const formationId = useLineupStore((s) => s.formationId)
  const players = useLineupStore((s) => s.players)
  const applyAutoLineup = useLineupStore((s) => s.applyAutoLineup)
  const formation = formationById(formationId)

  const result = useMemo(
    () => (open ? computeBestLineup(players, formation) : null),
    [open, players, formation],
  )

  if (!open || !result) return null

  // Score-Bonus für Stammpositionen kann den Gesamtwert über das theoretische
  // Maximum drücken; auf 100 % deckeln, damit die Anzeige nicht verwirrt.
  const percent = Math.min(100, Math.round((result.totalScore / result.maxPossibleScore) * 100))
  const incompleteCount = result.incompletePlayerIds.length
  const averageScore = result.totalScore / formation.slots.length

  const handleApply = () => {
    applyAutoLineup(result.assignments)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Beste Aufstellung"
      subtitle={`${formation.name} · Ø-Score ${averageScore.toFixed(1)} · ${percent}% vom Maximum`}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Abbrechen
          </button>
          <button
            onClick={handleApply}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-500"
          >
            Übernehmen
          </button>
        </>
      }
    >
      <>
        {incompleteCount > 0 && (
          <div className="border-b border-amber-700/40 bg-amber-950/40 px-5 py-2.5 text-xs text-amber-200">
            ⚠ {incompleteCount} Spieler {incompleteCount === 1 ? 'hat' : 'haben'} ein unvollständiges
            Profil. Fehlende Skills wurden mit dem Neutralwert 50 angenommen.
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-slate-800">
            {formation.slots.map((slot) => {
              const playerId = result.assignments[slot.id]
              const player = players.find((p) => p.id === playerId)
              const score = result.slotScores[slot.id] ?? 0
              const scoreHue =
                score >= 80 ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/40' :
                score >= 65 ? 'bg-sky-500/20 text-sky-200 ring-sky-500/40' :
                score >= 50 ? 'bg-amber-500/20 text-amber-200 ring-amber-500/40' :
                              'bg-rose-500/20 text-rose-200 ring-rose-500/40'
              const isIncomplete = player ? result.incompletePlayerIds.includes(player.id) : false
              return (
                <li key={slot.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-12 shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-center text-[11px] font-bold uppercase tracking-wide text-slate-200">
                    {positionShort[slot.position]}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {player ? (
                      <>
                        <PlayerAvatarMini player={player} />
                        <span className="truncate text-sm font-medium text-white">{player.name}</span>
                        {isIncomplete && (
                          <span className="shrink-0 text-[10px] text-amber-400" title="Profil unvollständig">
                            ⚠
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm italic text-slate-500">– nicht zuweisbar –</span>
                    )}
                  </div>
                  <span
                    className={[
                      'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ring-1',
                      scoreHue,
                    ].join(' ')}
                  >
                    {score.toFixed(0)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    </Modal>
  )
}
