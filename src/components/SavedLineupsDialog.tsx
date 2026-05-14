import { useEffect, useMemo, useRef, useState } from 'react'
import { formationById } from '../data/formations'
import { useLineupStore } from '../store/useLineupStore'
import { Modal } from './Modal'

type Props = {
  open: boolean
  onClose: () => void
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function SavedLineupsDialog({ open, onClose }: Props) {
  const savedLineups = useLineupStore((s) => s.savedLineups)
  const activeLineupId = useLineupStore((s) => s.activeLineupId)
  const formationId = useLineupStore((s) => s.formationId)
  const assignments = useLineupStore((s) => s.assignments)
  const saveAsNewLineup = useLineupStore((s) => s.saveAsNewLineup)
  const overwriteActiveLineup = useLineupStore((s) => s.overwriteActiveLineup)
  const loadLineup = useLineupStore((s) => s.loadLineup)
  const renameLineup = useLineupStore((s) => s.renameLineup)
  const deleteLineup = useLineupStore((s) => s.deleteLineup)

  const currentFormationName = formationById(formationId).name
  const filledCount = useMemo(
    () => Object.values(assignments).filter(Boolean).length,
    [assignments],
  )
  const totalSlots = formationById(formationId).slots.length
  const activeLineup = savedLineups.find((l) => l.id === activeLineupId) ?? null

  const [name, setName] = useState<string>(currentFormationName)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Beim Öffnen Default-Namen immer wieder auf die aktuelle Formation setzen.
  useEffect(() => {
    if (open) {
      setName(currentFormationName)
      setRenamingId(null)
      // Kurze Verzögerung, damit das Dialog-Element fokussiert werden kann
      setTimeout(() => inputRef.current?.select(), 30)
    }
  }, [open, currentFormationName])

  const handleSaveAsNew = () => {
    saveAsNewLineup(name)
    setName(currentFormationName)
  }

  const handleRenameCommit = (id: string) => {
    if (renameValue.trim()) renameLineup(id, renameValue)
    setRenamingId(null)
  }

  const handleDelete = (id: string, label: string) => {
    if (confirm(`„${label}" wirklich löschen?`)) deleteLineup(id)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Aufstellungen"
      subtitle={`${filledCount}/${totalSlots} Positionen besetzt · ${currentFormationName}`}
      ariaLabel="Gespeicherte Aufstellungen"
    >
      <>
        {/* Speicher-Bereich */}
        <div className="space-y-3 border-b border-slate-800 bg-slate-900/70 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Als neue Aufstellung speichern
            </span>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim()) {
                    e.preventDefault()
                    handleSaveAsNew()
                  }
                }}
                placeholder={currentFormationName}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={handleSaveAsNew}
                disabled={!name.trim()}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Speichern
              </button>
            </div>
          </label>

          {activeLineup && (
            <button
              onClick={overwriteActiveLineup}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Änderungen in „{activeLineup.name}" speichern
            </button>
          )}
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          {savedLineups.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Noch keine Aufstellungen gespeichert.
              <br />
              Name editieren und auf „Speichern" tippen.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {savedLineups.map((lineup) => {
                const isActive = lineup.id === activeLineupId
                const formation = formationById(lineup.formationId)
                const isRenaming = renamingId === lineup.id
                const occupied = Object.values(lineup.assignments).filter(Boolean).length
                return (
                  <li
                    key={lineup.id}
                    className={`px-5 py-3 transition ${isActive ? 'bg-emerald-950/30' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        {isRenaming ? (
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => handleRenameCommit(lineup.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameCommit(lineup.id)
                              if (e.key === 'Escape') setRenamingId(null)
                            }}
                            className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            style={{ fontSize: '16px' }}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white">
                              {lineup.name}
                            </span>
                            {isActive && (
                              <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                                aktiv
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-0.5 text-xs text-slate-400">
                          {formation.name} · {occupied}/{formation.slots.length} · {formatDate(lineup.updatedAt)}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => {
                            loadLineup(lineup.id)
                            onClose()
                          }}
                          className="rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-slate-700"
                        >
                          Laden
                        </button>
                        <button
                          onClick={() => {
                            setRenamingId(lineup.id)
                            setRenameValue(lineup.name)
                          }}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                          aria-label="Umbenennen"
                          title="Umbenennen"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(lineup.id, lineup.name)}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-950 hover:text-red-300"
                          aria-label="Löschen"
                          title="Löschen"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </>
    </Modal>
  )
}
