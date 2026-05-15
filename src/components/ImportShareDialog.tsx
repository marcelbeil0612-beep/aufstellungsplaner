import { formationById } from '../data/formations'
import { matchShareToRoster, type SharePayload } from '../lib/shareUrl'
import { useLineupStore } from '../store/useLineupStore'
import { Modal } from './Modal'

type Props = {
  payload: SharePayload | null
  onClose: () => void
}

export function ImportShareDialog({ payload, onClose }: Props) {
  const players = useLineupStore((s) => s.players)
  const applySharedLineup = useLineupStore((s) => s.applySharedLineup)

  if (!payload) return null

  const match = matchShareToRoster(payload, players)
  const formation = formationById(match.formationId)
  const total = payload.a.length
  const matched = match.assignments.length
  const subsTotal = payload.s?.length ?? 0
  const subsMatched = match.substitutions.length

  const handleImport = () => {
    applySharedLineup(match)
    onClose()
  }

  return (
    <Modal
      open={!!payload}
      onClose={onClose}
      title="Geteilte Aufstellung importieren"
      subtitle={`${formation.name} · ${matched}/${total} Spieler erkannt`}
      ariaLabel="Geteilte Aufstellung"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Verwerfen
          </button>
          <button
            onClick={handleImport}
            disabled={matched === 0}
            className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Als neue Aufstellung übernehmen
          </button>
        </>
      }
    >
      <div className="space-y-4 overflow-y-auto px-5 py-4 text-sm text-slate-200">
        {payload.t && (
          <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
            <span className="text-xs text-slate-500">Titel · </span>
            <span className="font-medium">{payload.t}</span>
          </p>
        )}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
          <div>
            <span className="text-slate-500">System:</span> {formation.name}
          </div>
          <div className="mt-1">
            <span className="text-slate-500">Spieler im Plan:</span> {matched} von {total} im
            eigenen Kader gefunden
          </div>
          {subsTotal > 0 && (
            <div className="mt-1">
              <span className="text-slate-500">Wechsel:</span> {subsMatched} von {subsTotal}{' '}
              übertragbar
            </div>
          )}
        </div>

        {match.missingPlayers.length > 0 && (
          <div className="rounded-lg border border-amber-700/40 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
            <p className="font-semibold">Fehlende Spieler im eigenen Kader:</p>
            <p className="mt-1 leading-snug">{match.missingPlayers.join(', ')}</p>
            <p className="mt-2 text-[11px] text-amber-200/80">
              Diese Slots bleiben beim Import frei. Lege die Spieler im Kader an (gleiche
              Schreibweise) und teile den Link erneut, falls du sie übernehmen willst.
            </p>
          </div>
        )}

        {matched === 0 && (
          <p className="rounded-lg border border-rose-700/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
            Kein einziger Spieler aus dem geteilten Link konnte im eigenen Kader gefunden
            werden – Import macht keinen Sinn.
          </p>
        )}
      </div>
    </Modal>
  )
}
