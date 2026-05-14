import { useRef, useState } from 'react'
import { downloadBackup, importBackupFile } from '../lib/backup'
import { usePlayerPhotoUrl } from '../store/photoStore'
import { useLineupStore } from '../store/useLineupStore'
import type { Player, PlayerStatus, Role, Skills } from '../types'
import { fileToSquareBlob, initials } from '../lib/photoUtils'
import { Modal } from './Modal'

const statusOptions: { value: PlayerStatus | null; label: string; icon: string; color: string }[] = [
  { value: null,         label: 'Verfügbar', icon: '✓',  color: 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/40' },
  { value: 'injured',    label: 'Verletzt',  icon: '🤕', color: 'bg-rose-500/20 text-rose-200 ring-rose-500/40' },
  { value: 'suspended',  label: 'Gesperrt',  icon: '🟥', color: 'bg-amber-500/20 text-amber-200 ring-amber-500/40' },
  { value: 'absent',     label: 'Abwesend',  icon: '🚫', color: 'bg-slate-500/20 text-slate-200 ring-slate-500/40' },
]

export const statusLabels: Record<PlayerStatus, string> = {
  injured: 'verletzt',
  suspended: 'gesperrt',
  absent: 'abwesend',
}

export const statusIcons: Record<PlayerStatus, string> = {
  injured: '🤕',
  suspended: '🟥',
  absent: '🚫',
}

type Props = {
  open: boolean
  onClose: () => void
}

type SkillColumn = {
  key: keyof Skills
  label: string
  /** Kurzform als Tooltip, falls Spalte eng wird. */
  title?: string
}

const fieldSkillColumns: SkillColumn[] = [
  { key: 'pace',      label: 'Tempo' },
  { key: 'shooting',  label: 'Schuss' },
  { key: 'passing',   label: 'Pass' },
  { key: 'dribbling', label: 'Dribb.', title: 'Dribbling' },
  { key: 'defending', label: 'Def.',   title: 'Verteidigung' },
  { key: 'physical',  label: 'Physis' },
]

const gkSkillColumns: SkillColumn[] = [
  { key: 'gkReflexes',    label: 'Reflexe' },
  { key: 'gkHandling',    label: 'Fangen' },
  { key: 'gkDiving',      label: 'Flug',   title: 'Flugparaden' },
  { key: 'gkPositioning', label: 'Stell.', title: 'Stellungsspiel' },
  { key: 'gkKicking',     label: 'Abschl.', title: 'Abschlag / Kicking' },
  { key: 'pace',          label: 'Tempo' },
]

function PhotoCell({ player }: { player: Player }) {
  const setPlayerPhoto = useLineupStore((s) => s.setPlayerPhoto)
  const photoUrl = usePlayerPhotoUrl(player)
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFile = async (file: File) => {
    setError(null)
    setBusy(true)
    try {
      const blob = await fileToSquareBlob(file, 256, 0.85)
      await setPlayerPhoto(player.id, blob)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={[
          'relative h-12 w-12 overflow-hidden rounded-full ring-2 transition',
          player.role === 'GK' ? 'ring-amber-400' : 'ring-sky-400',
          photoUrl ? 'bg-slate-800' : player.role === 'GK'
            ? 'bg-gradient-to-br from-amber-500 to-amber-700'
            : 'bg-gradient-to-br from-sky-500 to-indigo-700',
          busy ? 'opacity-50' : 'hover:brightness-110',
        ].join(' ')}
        aria-label={`Foto für ${player.name} ändern`}
        title="Foto hochladen"
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
            {initials(player.name)}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-semibold uppercase text-white">
          {photoUrl ? 'Foto' : '+ Foto'}
        </span>
      </button>
      {photoUrl && (
        <button
          type="button"
          onClick={() => void setPlayerPhoto(player.id, null)}
          className="text-[10px] text-slate-400 hover:text-red-400"
        >
          entfernen
        </button>
      )}
      {error && <span className="text-[10px] text-red-400">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void onFile(f)
          e.target.value = '' // damit das gleiche File erneut auswählbar ist
        }}
      />
    </div>
  )
}

function NameCell({ player }: { player: Player }) {
  const renamePlayer = useLineupStore((s) => s.renamePlayer)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(player.name)

  const commit = () => {
    setEditing(false)
    const trimmed = value.trim()
    if (trimmed && trimmed !== player.name) renamePlayer(player.id, trimmed)
    else setValue(player.name)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setEditing(false)
            setValue(player.name)
          }
        }}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
        style={{ fontSize: '16px' }}
        aria-label={`Name für ${player.name} ändern`}
      />
    )
  }
  return (
    <button
      type="button"
      onClick={() => {
        setValue(player.name)
        setEditing(true)
      }}
      className="-mx-1 rounded px-1 py-0.5 text-left font-medium text-white transition hover:bg-slate-800"
      title="Klicken zum Umbenennen"
    >
      {player.name}
    </button>
  )
}

function NumberCell({ player }: { player: Player }) {
  const setPlayerNumber = useLineupStore((s) => s.setPlayerNumber)
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={99}
      step={1}
      placeholder="–"
      value={player.number ?? ''}
      onChange={(e) => {
        const raw = e.target.value
        if (raw === '') {
          setPlayerNumber(player.id, null)
          return
        }
        const n = parseInt(raw, 10)
        if (Number.isFinite(n)) setPlayerNumber(player.id, n)
      }}
      className="w-14 rounded-md border border-slate-700 bg-slate-950 px-1 py-1 text-center text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
      style={{ fontSize: '16px' }}
      aria-label={`Trikotnummer für ${player.name}`}
    />
  )
}

function StatusCell({ player }: { player: Player }) {
  const setPlayerStatus = useLineupStore((s) => s.setPlayerStatus)
  return (
    <div className="flex justify-center gap-1" role="radiogroup" aria-label={`Status für ${player.name}`}>
      {statusOptions.map((opt) => {
        const active = (player.status ?? null) === opt.value
        return (
          <button
            key={opt.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPlayerStatus(player.id, opt.value)}
            title={opt.label}
            className={[
              'h-7 w-7 rounded-md text-sm transition ring-1',
              active ? opt.color : 'bg-slate-900/50 text-slate-500 ring-slate-700 hover:text-slate-200',
            ].join(' ')}
          >
            <span aria-hidden>{opt.icon}</span>
          </button>
        )
      })}
    </div>
  )
}

function DeleteCell({ player }: { player: Player }) {
  const removePlayer = useLineupStore((s) => s.removePlayer)
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(`Spieler „${player.name}" wirklich entfernen?`)) {
          void removePlayer(player.id)
        }
      }}
      className="rounded-md p-1.5 text-slate-500 transition hover:bg-rose-950 hover:text-rose-300"
      aria-label={`${player.name} entfernen`}
      title="Spieler entfernen"
    >
      🗑
    </button>
  )
}

function AddPlayerForm() {
  const addPlayer = useLineupStore((s) => s.addPlayer)
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('FIELD')

  const handleAdd = () => {
    if (!name.trim()) return
    addPlayer(name, role)
    setName('')
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
        Neuen Spieler hinzufügen
      </h3>
      <div className="flex flex-wrap items-stretch gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder="Vorname / Spitzname"
          className="min-w-[160px] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          style={{ fontSize: '16px' }}
          aria-label="Name des neuen Spielers"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          aria-label="Rolle"
        >
          <option value="FIELD">Feldspieler</option>
          <option value="GK">Torhüter</option>
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hinzufügen
        </button>
      </div>
    </section>
  )
}

function SkillInput({
  player,
  skillKey,
  skillLabel,
}: {
  player: Player
  skillKey: keyof Skills
  /** Deutscher Anzeigename des Skills (z. B. „Tempo") für Screenreader. */
  skillLabel: string
}) {
  const updatePlayerSkills = useLineupStore((s) => s.updatePlayerSkills)
  const value = player.skills?.[skillKey]
  return (
    <input
      type="number"
      inputMode="numeric"
      min={1}
      max={99}
      step={1}
      placeholder="–"
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value
        if (raw === '') {
          updatePlayerSkills(player.id, { [skillKey]: undefined })
          return
        }
        const n = Math.max(1, Math.min(99, parseInt(raw, 10)))
        if (Number.isFinite(n)) updatePlayerSkills(player.id, { [skillKey]: n })
      }}
      className="w-14 rounded-md border border-slate-700 bg-slate-950 px-1 py-1 text-center text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
      style={{ fontSize: '16px' }}
      aria-label={`${skillLabel} – ${player.name}`}
    />
  )
}

function SkillTable({
  title,
  accent,
  players,
  columns,
}: {
  title: string
  accent: string
  players: Player[]
  columns: SkillColumn[]
}) {
  if (players.length === 0) {
    return (
      <section>
        <h3 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${accent}`}>{title}</h3>
        <p className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-4 py-3 text-xs text-slate-500">
          Noch keine Spieler in dieser Gruppe – oben hinzufügen.
        </p>
      </section>
    )
  }
  return (
    <section>
      <h3 className={`mb-2 text-xs font-semibold uppercase tracking-wider ${accent}`}>{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-slate-900/80">
            <tr className="text-[10px] uppercase tracking-wider text-slate-400">
              <th className="sticky left-0 z-10 bg-slate-900/80 px-3 py-2 text-left">Foto</th>
              <th className="sticky left-[60px] z-10 bg-slate-900/80 px-2 py-2 text-left">Name</th>
              <th className="px-1.5 py-2 text-center font-semibold">Nr.</th>
              <th className="px-1.5 py-2 text-center font-semibold">Status</th>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  title={c.title ?? c.label}
                  className="px-1.5 py-2 text-center font-semibold"
                >
                  {c.label}
                </th>
              ))}
              <th className="px-2 py-2 text-right font-semibold" aria-label="Aktionen" />
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => (
              <tr
                key={p.id}
                className={[
                  'transition',
                  idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20',
                ].join(' ')}
              >
                <td className="sticky left-0 z-[5] border-t border-slate-800 bg-slate-950/80 px-3 py-2">
                  <PhotoCell player={p} />
                </td>
                <td className="sticky left-[60px] z-[5] border-t border-slate-800 bg-slate-950/80 px-2 py-2">
                  <NameCell player={p} />
                </td>
                <td className="border-t border-slate-800 px-1 py-2 text-center">
                  <NumberCell player={p} />
                </td>
                <td className="border-t border-slate-800 px-1 py-2">
                  <StatusCell player={p} />
                </td>
                {columns.map((c) => (
                  <td key={String(c.key)} className="border-t border-slate-800 px-1 py-2 text-center">
                    <SkillInput player={p} skillKey={c.key} skillLabel={c.title ?? c.label} />
                  </td>
                ))}
                <td className="border-t border-slate-800 px-2 py-2 text-right">
                  <DeleteCell player={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function BackupSection() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const handleRestore = async (file: File) => {
    setStatus(null)
    if (!confirm('Aktuelle Daten werden mit dem Backup-Inhalt überschrieben. Fortfahren?')) return
    try {
      await importBackupFile(file)
      setStatus({ kind: 'ok', text: 'Backup erfolgreich wiederhergestellt.' })
    } catch (e) {
      setStatus({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Unbekannter Fehler beim Wiederherstellen.',
      })
    }
  }

  return (
    <section className="rounded-xl border border-emerald-800/50 bg-emerald-950/40 p-4">
      <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-200">
        <span aria-hidden>🛟</span> Backup &amp; Wiederherstellen
      </h3>
      <p className="mb-3 text-xs leading-snug text-emerald-200/80">
        Deine Fotos, Skills und gespeicherten Aufstellungen liegen lokal im Browser. Dateien in
        „Einstellungen → Safari → Daten löschen" oder ein System-Reset können sie entfernen –
        mach ab und zu ein Backup und leg die Datei in „Dateien" oder iCloud ab.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            downloadBackup()
            setStatus({ kind: 'ok', text: 'Backup-Datei wurde heruntergeladen.' })
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <span aria-hidden>⬇</span> Backup herunterladen
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/70 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-emerald-200 transition hover:bg-slate-800"
        >
          <span aria-hidden>⬆</span> Backup wiederherstellen
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleRestore(f)
            e.target.value = ''
          }}
        />
      </div>
      {status && (
        <p
          className={[
            'mt-2 text-xs',
            status.kind === 'ok' ? 'text-emerald-300' : 'text-rose-300',
          ].join(' ')}
        >
          {status.text}
        </p>
      )}
    </section>
  )
}

export function RosterDialog({ open, onClose }: Props) {
  const players = useLineupStore((s) => s.players)

  const goalkeepers = players.filter((p) => p.role === 'GK')
  const fieldPlayers = players.filter((p) => p.role === 'FIELD')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Kader verwalten"
      subtitle="Fotos hochladen und Skill-Werte (1–99) pro Spieler eintragen. Alles wird lokal gespeichert."
      size="4xl"
      maxHeight="95vh"
    >
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <BackupSection />
        <AddPlayerForm />
        <SkillTable
          title="Torhüter"
          accent="text-amber-400/80"
          players={goalkeepers}
          columns={gkSkillColumns}
        />
        <SkillTable
          title="Feldspieler"
          accent="text-sky-400/80"
          players={fieldPlayers}
          columns={fieldSkillColumns}
        />

        <p className="pt-2 text-[11px] text-slate-500">
          Tipp: Klick auf einen Namen, um ihn umzubenennen. Leere Skill-Felder bedeuten
          „noch nicht bewertet" und fließen mit dem Neutralwert 50 in die Auto-Aufstellung ein.
        </p>
      </div>
    </Modal>
  )
}
