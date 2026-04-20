import { useDroppable } from '@dnd-kit/core'
import { selectBenchPlayers, useLineupStore } from '../store/useLineupStore'
import { PlayerChip } from './PlayerChip'

export function Bench() {
  const players = useLineupStore(selectBenchPlayers)
  const { isOver, setNodeRef, active } = useDroppable({
    id: 'bench',
    data: { isBench: true },
  })

  const draggedFromSlot = active?.data.current && (active.data.current as { source?: string }).source !== 'bench'

  const goalkeepers = players.filter((p) => p.role === 'GK')
  const fieldPlayers = players.filter((p) => p.role === 'FIELD')

  return (
    <aside
      ref={setNodeRef}
      className={[
        'flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl backdrop-blur',
        'transition',
        isOver && draggedFromSlot ? 'ring-2 ring-emerald-400/70 bg-slate-800/80' : '',
      ].join(' ')}
    >
      <header>
        <h2 className="text-lg font-bold text-white">Kader</h2>
        <p className="text-xs text-slate-400">
          {players.length} Spieler verfügbar · zum Aufstellen aufs Feld ziehen
        </p>
      </header>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/80">
          Torhüter
        </h3>
        {goalkeepers.length === 0 ? (
          <p className="text-xs text-slate-500">Alle aufgestellt.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {goalkeepers.map((p) => (
              <PlayerChip key={p.id} player={p} source="bench" />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-400/80">
          Feldspieler
        </h3>
        {fieldPlayers.length === 0 ? (
          <p className="text-xs text-slate-500">Alle aufgestellt.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {fieldPlayers.map((p) => (
              <PlayerChip key={p.id} player={p} source="bench" />
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}
