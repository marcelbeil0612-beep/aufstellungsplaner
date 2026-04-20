import { useLineupStore } from '../store/useLineupStore'
import { FormationPicker } from './FormationPicker'

export function Header() {
  const reset = useLineupStore((s) => s.reset)

  return (
    <header className="flex flex-col gap-3 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Aufstellungsplaner
        </h1>
        <p className="text-xs text-slate-400">
          Spieler per Drag-and-Drop aufs Feld ziehen · Formation wählen · Aufstellung wird lokal gespeichert
        </p>
      </div>
      <div className="flex items-center gap-3">
        <FormationPicker />
        <button
          onClick={() => {
            if (confirm('Aufstellung wirklich zurücksetzen?')) reset()
          }}
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 shadow-inner transition hover:bg-slate-800"
        >
          Zurücksetzen
        </button>
      </div>
    </header>
  )
}
