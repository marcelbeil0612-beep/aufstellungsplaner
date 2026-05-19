import { useState } from 'react'
import { useProGuard } from '../lib/proAccess'
import { useLineupStore } from '../store/useLineupStore'
import { AutoLineupDialog } from './AutoLineupDialog'
import { FormationPicker } from './FormationPicker'
import { MatchesDialog } from './MatchesDialog'
import { RosterDialog } from './RosterDialog'
import { SavedLineupsDialog } from './SavedLineupsDialog'
import { TacticBookDialog } from './TacticBook/TacticBookDialog'

export function Header() {
  const reset = useLineupStore((s) => s.reset)
  const savedCount = useLineupStore((s) => s.savedLineups.length)
  const matchesCount = useLineupStore((s) => s.matches.length)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rosterOpen, setRosterOpen] = useState(false)
  const [autoOpen, setAutoOpen] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [matchesOpen, setMatchesOpen] = useState(false)
  const { allowed: autoAllowed, guard: guardAuto } = useProGuard('auto-lineup')

  return (
    <>
      <header
        className="flex flex-col gap-3 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 1.5rem)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 1.5rem)',
        }}
      >
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            FormaXI
          </h1>
          <p className="text-xs text-slate-400">
            Spieler per Drag-and-Drop aufs Feld ziehen · Formation wählen · Aufstellung wird lokal gespeichert
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <FormationPicker />
          <button
            onClick={() => guardAuto(() => setAutoOpen(true))}
            className="flex items-center gap-1.5 rounded-lg border border-amber-600 bg-amber-800/40 px-3 py-1.5 text-sm font-medium text-amber-100 shadow-inner transition hover:bg-amber-700/50"
            title={
              autoAllowed
                ? 'Aufstellung automatisch nach Skill-Score optimieren'
                : 'Aufstellung automatisch optimieren · Pro'
            }
          >
            <span aria-hidden>⚡</span>
            <span className="hidden sm:inline">Beste Aufstellung</span>
            <span className="sm:hidden">Auto</span>
            {!autoAllowed && <span aria-hidden className="text-[10px] opacity-70">🔒</span>}
          </button>
          <button
            onClick={() => setRosterOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-sky-700 bg-sky-800/40 px-3 py-1.5 text-sm font-medium text-sky-100 shadow-inner transition hover:bg-sky-700/50"
          >
            <span aria-hidden>👥</span>
            <span>Kader</span>
          </button>
          <button
            onClick={() => setBookOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-700 bg-indigo-800/40 px-3 py-1.5 text-sm font-medium text-indigo-100 shadow-inner transition hover:bg-indigo-700/50"
            title="Taktik-Nachschlagewerk für den Spieltag"
          >
            <span aria-hidden>📖</span>
            <span>Systembuch</span>
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-700 bg-emerald-800/40 px-3 py-1.5 text-sm font-medium text-emerald-100 shadow-inner transition hover:bg-emerald-700/50"
          >
            <span aria-hidden>💾</span>
            <span>Aufstellungen</span>
            {savedCount > 0 && (
              <span className="ml-0.5 rounded-full bg-emerald-500/30 px-1.5 text-[11px] font-semibold">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMatchesOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 shadow-inner transition hover:bg-slate-800"
            title="Spielprotokoll: Datum, Gegner, Ergebnis, Notizen"
          >
            <span aria-hidden>📋</span>
            <span>Spiele</span>
            {matchesCount > 0 && (
              <span className="ml-0.5 rounded-full bg-slate-500/30 px-1.5 text-[11px] font-semibold">
                {matchesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (confirm('Aufstellung wirklich zurücksetzen?')) reset()
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 shadow-inner transition hover:bg-slate-800"
          >
            Zurücksetzen
          </button>
          <a
            href="/hilfe"
            target="_blank"
            rel="noopener noreferrer external"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-sm font-semibold text-slate-200 shadow-inner transition hover:bg-slate-800"
            title="Anleitung & Hilfe"
            aria-label="Anleitung und Hilfe"
          >
            ?
          </a>
        </div>
      </header>

      <SavedLineupsDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <RosterDialog open={rosterOpen} onClose={() => setRosterOpen(false)} />
      <AutoLineupDialog open={autoOpen} onClose={() => setAutoOpen(false)} />
      <TacticBookDialog open={bookOpen} onClose={() => setBookOpen(false)} />
      <MatchesDialog open={matchesOpen} onClose={() => setMatchesOpen(false)} />
    </>
  )
}
