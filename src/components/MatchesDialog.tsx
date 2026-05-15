import { useMemo, useState } from 'react'
import { formationById } from '../data/formations'
import { useLineupStore } from '../store/useLineupStore'
import type { Match } from '../types'
import { Modal } from './Modal'

type Props = {
  open: boolean
  onClose: () => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function ResultBadge({ ours, opp }: { ours?: number; opp?: number }) {
  if (typeof ours !== 'number' || typeof opp !== 'number') {
    return <span className="text-xs italic text-slate-500">offen</span>
  }
  const tone =
    ours > opp ? 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/40' :
    ours < opp ? 'bg-rose-500/20 text-rose-200 ring-rose-500/40' :
                 'bg-amber-500/20 text-amber-200 ring-amber-500/40'
  return (
    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ring-1 ${tone}`}>
      {ours}:{opp}
    </span>
  )
}

function MatchRow({
  match,
  expanded,
  onToggle,
}: {
  match: Match
  expanded: boolean
  onToggle: () => void
}) {
  const savedLineups = useLineupStore((s) => s.savedLineups)
  const updateMatch = useLineupStore((s) => s.updateMatch)
  const removeMatch = useLineupStore((s) => s.removeMatch)

  const linkedLineup = match.lineupId
    ? savedLineups.find((l) => l.id === match.lineupId)
    : undefined
  const formation = linkedLineup ? formationById(linkedLineup.formationId) : undefined

  return (
    <li className="rounded-xl border border-slate-800 bg-slate-950/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-slate-900/60"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 tabular-nums">{formatDate(match.date)}</span>
            {match.venue && (
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                {match.venue === 'home' ? 'Heim' : 'Auswärts'}
              </span>
            )}
          </div>
          <div className="truncate text-sm font-semibold text-white">{match.opponent || '– kein Gegner –'}</div>
          {linkedLineup && (
            <div className="mt-0.5 text-[11px] text-slate-500">
              {linkedLineup.name} · {formation?.name}
            </div>
          )}
        </div>
        <ResultBadge ours={match.ourGoals} opp={match.oppGoals} />
        <span className="shrink-0 text-slate-500 transition" aria-hidden>
          {expanded ? '▴' : '▾'}
        </span>
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-slate-800 px-3 py-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="text-[11px] text-slate-400">
              Datum
              <input
                type="date"
                value={match.date}
                onChange={(e) => updateMatch(match.id, { date: e.target.value })}
                className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </label>
            <label className="text-[11px] text-slate-400">
              Heim/Auswärts
              <select
                value={match.venue ?? ''}
                onChange={(e) =>
                  updateMatch(match.id, {
                    venue: e.target.value === '' ? undefined : (e.target.value as 'home' | 'away'),
                  })
                }
                className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              >
                <option value="">–</option>
                <option value="home">Heim</option>
                <option value="away">Auswärts</option>
              </select>
            </label>
            <label className="text-[11px] text-slate-400">
              Tore eigen
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="–"
                value={match.ourGoals ?? ''}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === '') updateMatch(match.id, { ourGoals: undefined })
                  else {
                    const n = parseInt(raw, 10)
                    if (Number.isFinite(n)) updateMatch(match.id, { ourGoals: Math.max(0, n) })
                  }
                }}
                className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-center text-sm text-white focus:border-emerald-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </label>
            <label className="text-[11px] text-slate-400">
              Tore Gegner
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="–"
                value={match.oppGoals ?? ''}
                onChange={(e) => {
                  const raw = e.target.value
                  if (raw === '') updateMatch(match.id, { oppGoals: undefined })
                  else {
                    const n = parseInt(raw, 10)
                    if (Number.isFinite(n)) updateMatch(match.id, { oppGoals: Math.max(0, n) })
                  }
                }}
                className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-center text-sm text-white focus:border-emerald-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
            </label>
          </div>
          <label className="block text-[11px] text-slate-400">
            Gegner
            <input
              type="text"
              value={match.opponent}
              onChange={(e) => updateMatch(match.id, { opponent: e.target.value })}
              className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
              style={{ fontSize: '16px' }}
            />
          </label>
          <label className="block text-[11px] text-slate-400">
            Aufstellung
            <select
              value={match.lineupId ?? ''}
              onChange={(e) =>
                updateMatch(match.id, { lineupId: e.target.value || undefined })
              }
              className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
              style={{ fontSize: '16px' }}
            >
              <option value="">– keine Verknüpfung –</option>
              {savedLineups.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px] text-slate-400">
            Notizen
            <textarea
              value={match.notes ?? ''}
              onChange={(e) => updateMatch(match.id, { notes: e.target.value || undefined })}
              rows={3}
              placeholder="Spielnotizen, taktische Beobachtungen, …"
              className="mt-0.5 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
              style={{ fontSize: '16px' }}
            />
          </label>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (confirm(`Spiel gegen „${match.opponent}" wirklich entfernen?`)) {
                  removeMatch(match.id)
                }
              }}
              className="rounded-md px-2 py-1 text-xs text-slate-500 transition hover:bg-rose-950 hover:text-rose-300"
            >
              🗑 Entfernen
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export function MatchesDialog({ open, onClose }: Props) {
  const matches = useLineupStore((s) => s.matches)
  const addMatch = useLineupStore((s) => s.addMatch)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...matches].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [matches],
  )

  const handleAdd = () => {
    const id = addMatch({ date: todayIso(), opponent: '' })
    setExpandedId(id)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Spielprotokoll"
      subtitle={
        matches.length === 0
          ? 'Halte Datum, Gegner, Ergebnis und Notizen je Spiel fest.'
          : `${matches.length} ${matches.length === 1 ? 'Eintrag' : 'Einträge'}`
      }
      size="2xl"
      maxHeight="92vh"
      footer={
        <>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            + Neues Spiel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Fertig
          </button>
        </>
      }
    >
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-5 py-10 text-center text-sm text-slate-400">
            Noch kein Spiel im Protokoll.
            <br />
            Tippe unten auf <span className="font-semibold text-emerald-300">+ Neues Spiel</span>, um einen Eintrag anzulegen.
          </div>
        ) : (
          <ul className="space-y-2">
            {sorted.map((m) => (
              <MatchRow
                key={m.id}
                match={m}
                expanded={expandedId === m.id}
                onToggle={() => setExpandedId((cur) => (cur === m.id ? null : m.id))}
              />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}
