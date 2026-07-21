import { useMemo } from 'react'
import { useLineupStore } from '../store/useLineupStore'
import type { Player, Substitution } from '../types'
import { Modal } from './Modal'

type Props = {
  open: boolean
  onClose: () => void
}

/** Sortiert die Spieler: Torhüter zuerst, dann nach Trikotnummer (mit-Nummer vor ohne-Nummer), dann Name. */
function sortedPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    if (a.role !== b.role) return a.role === 'GK' ? -1 : 1
    const an = typeof a.number === 'number' ? a.number : 999
    const bn = typeof b.number === 'number' ? b.number : 999
    if (an !== bn) return an - bn
    return a.name.localeCompare(b.name, 'de')
  })
}

const optionLabel = (p: Player): string =>
  `${typeof p.number === 'number' ? `${p.number} · ${p.name}` : p.name}${p.role === 'GK' ? ' (TW)' : ''}`

function PlayerSelect({
  value,
  onChange,
  players,
  fallbackPool,
  placeholder,
  label,
}: {
  value: string
  onChange: (id: string) => void
  players: Player[]
  /**
   * Gesamter Kader – nur als Rückfalltopf. Zeigt einen bereits gewählten
   * Spieler weiter an, auch wenn er inzwischen nicht mehr in die Liste gehört
   * (Aufstellung geändert, Bank umgebaut). Sonst verschwände ein gespeicherter
   * Wechsel stumm aus dem Plan.
   */
  fallbackPool: Player[]
  placeholder: string
  label: string
}) {
  const inList = players.some((p) => p.id === value)
  const stale = !inList && value ? fallbackPool.find((p) => p.id === value) : undefined

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
      style={{ fontSize: '16px' }}
      aria-label={label}
    >
      <option value="">{placeholder}</option>
      {players.map((p) => (
        <option key={p.id} value={p.id}>
          {optionLabel(p)}
        </option>
      ))}
      {stale && (
        <option key={stale.id} value={stale.id}>
          {optionLabel(stale)} — nicht mehr im Plan
        </option>
      )}
    </select>
  )
}

function SubstitutionRow({
  index,
  sub,
  onPitch,
  onBench,
  roster,
  onChange,
  onRemove,
}: {
  index: number
  sub: Substitution
  onPitch: Player[]
  onBench: Player[]
  roster: Player[]
  onChange: (patch: Partial<Omit<Substitution, 'id'>>) => void
  onRemove: () => void
}) {
  return (
    <li className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 sm:grid-cols-[60px_1fr_1fr_1.2fr_36px] sm:items-center">
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={120}
        placeholder="Min."
        value={sub.minute ?? ''}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '') {
            onChange({ minute: undefined })
            return
          }
          const n = parseInt(raw, 10)
          if (Number.isFinite(n)) onChange({ minute: Math.max(1, Math.min(120, n)) })
        }}
        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-center text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
        style={{ fontSize: '16px' }}
        aria-label={`Minute der ${index + 1}. Auswechslung`}
      />
      <PlayerSelect
        value={sub.outPlayerId}
        onChange={(id) => onChange({ outPlayerId: id })}
        players={onPitch}
        fallbackPool={roster}
        placeholder="Spieler raus…"
        label={`Spieler raus (${index + 1}. Wechsel)`}
      />
      <PlayerSelect
        value={sub.inPlayerId}
        onChange={(id) => onChange({ inPlayerId: id })}
        players={onBench}
        fallbackPool={roster}
        placeholder="Spieler rein…"
        label={`Spieler rein (${index + 1}. Wechsel)`}
      />
      <input
        type="text"
        placeholder="Notiz (optional)"
        value={sub.note ?? ''}
        onChange={(e) => onChange({ note: e.target.value || undefined })}
        className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
        style={{ fontSize: '16px' }}
        aria-label={`Notiz zur ${index + 1}. Auswechslung`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-950 hover:text-rose-300"
        aria-label="Auswechslung entfernen"
        title="Entfernen"
      >
        🗑
      </button>
    </li>
  )
}

export function SubstitutionsDialog({ open, onClose }: Props) {
  const substitutions = useLineupStore((s) => s.substitutions)
  const players = useLineupStore((s) => s.players)
  const addSubstitution = useLineupStore((s) => s.addSubstitution)
  const updateSubstitution = useLineupStore((s) => s.updateSubstitution)
  const removeSubstitution = useLineupStore((s) => s.removeSubstitution)
  const clearSubstitutions = useLineupStore((s) => s.clearSubstitutions)

  const assignments = useLineupStore((s) => s.assignments)
  const bench = useLineupStore((s) => s.bench)

  const sortedRoster = useMemo(() => sortedPlayers(players), [players])
  // „Raus" kann nur, wer spielt. „Rein" nur, wer auf der Bank sitzt – das ist
  // die Regel auf dem Platz und seit der Ersatzbank auch hier abbildbar.
  const onPitch = useMemo(() => {
    const ids = new Set(Object.values(assignments).filter(Boolean) as string[])
    return sortedPlayers(players.filter((p) => ids.has(p.id)))
  }, [players, assignments])
  const onBench = useMemo(() => {
    const ids = new Set(bench.filter(Boolean) as string[])
    return sortedPlayers(players.filter((p) => ids.has(p.id)))
  }, [players, bench])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Wechselplan"
      subtitle={
        substitutions.length === 0
          ? 'Plane bis zu 5 Auswechslungen vor dem Spiel.'
          : `${substitutions.length} ${substitutions.length === 1 ? 'Wechsel' : 'Wechsel'} geplant`
      }
      size="2xl"
      maxHeight="92vh"
      footer={
        <>
          {substitutions.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Alle geplanten Auswechslungen wirklich löschen?')) {
                  clearSubstitutions()
                }
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-rose-950 hover:text-rose-200"
            >
              Alle entfernen
            </button>
          )}
          <button
            onClick={() => addSubstitution()}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            + Wechsel
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
        {onBench.length === 0 && (
          <div className="mb-3 rounded-lg border border-amber-700/40 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
            Die Ersatzbank ist leer – es steht niemand zum Einwechseln bereit. Zieh unter dem
            Spielfeld Spieler aus dem Kader auf die Bank.
          </div>
        )}
        {substitutions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-5 py-10 text-center text-sm text-slate-400">
            Noch keine Wechsel geplant.
            <br />
            Tippe unten auf <span className="font-semibold text-emerald-300">+ Wechsel</span>, um einen hinzuzufügen.
          </div>
        ) : (
          <ul className="space-y-2">
            {substitutions.map((sub, i) => (
              <SubstitutionRow
                key={sub.id}
                index={i}
                sub={sub}
                onPitch={onPitch}
                onBench={onBench}
                roster={sortedRoster}
                onChange={(patch) => updateSubstitution(sub.id, patch)}
                onRemove={() => removeSubstitution(sub.id)}
              />
            ))}
          </ul>
        )}
        <p className="mt-4 text-[11px] text-slate-500">
          Die Wechsel werden mit der Aufstellung gespeichert. Beim Laden einer früheren Aufstellung
          erscheint ihr Plan automatisch hier.
        </p>
      </div>
    </Modal>
  )
}
