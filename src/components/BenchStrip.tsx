import { useDroppable } from '@dnd-kit/core'
import type { Player } from '../types'
import {
  BENCH_SIZE,
  selectBenchCount,
  selectBenchSeats,
  useLineupStore,
} from '../store/useLineupStore'
import { PlayerChip } from './PlayerChip'

/** Quelle-Präfix für Drags, die von einem Bankplatz ausgehen (siehe App.tsx). */
export const BENCH_SOURCE_PREFIX = 'bench-seat:'

type SeatProps = {
  index: number
  player: Player | null
}

function BenchSeat({ index, player }: SeatProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `bench-seat:${index}`,
    data: { benchIndex: index },
  })

  return (
    <div
      ref={setNodeRef}
      className={[
        'flex w-[68px] shrink-0 flex-col items-center rounded-xl p-1 transition',
        isOver ? 'bg-emerald-400/20 ring-2 ring-emerald-400/80' : '',
      ].join(' ')}
    >
      {player ? (
        <PlayerChip player={player} source={`${BENCH_SOURCE_PREFIX}${index}`} />
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-slate-600 bg-slate-950/50 text-sm font-black tabular-nums text-slate-600"
            aria-label={`Bankplatz ${index + 1} frei`}
          >
            {index + 1}
          </div>
          {/* Platzhalter in Höhe der Namens-Pille, damit die Reihe nicht springt. */}
          <span className="h-[18px]" aria-hidden />
        </div>
      )}
    </div>
  )
}

/**
 * Ersatzbank unter dem Spielfeld: feste Sitzplätze, per Drag-and-Drop besetzbar.
 * Bewusst getrennt vom Kader-Panel – dort steht, wer verfügbar ist, hier steht,
 * wer nominiert ist.
 */
export function BenchStrip() {
  const seats = useLineupStore(selectBenchSeats)
  const count = useLineupStore(selectBenchCount)

  // Bewusst ist NUR der einzelne Sitzplatz ein Drop-Ziel, nicht die Leiste:
  // ein zusätzliches, größeres Droppable darüber würde bei rectIntersection
  // die Kollision gewinnen und das gezielte Ablegen auf einem Platz kaputtmachen.
  return (
    <section
      data-tour="bench"
      className="mt-3 w-full max-w-[480px] rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-xl backdrop-blur"
    >
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Ersatzbank
        </h2>
        <p className="text-xs tabular-nums text-slate-500">
          {count} / {BENCH_SIZE} besetzt
        </p>
      </header>

      {/* Bei schmalen Viewports scrollt die Reihe in sich – die Seite nie horizontal. */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {seats.map((player, i) => (
          <BenchSeat key={i} index={i} player={player} />
        ))}
      </div>

      {count === 0 && (
        <p className="mt-1 text-[11px] text-slate-500">
          Spieler aus dem Kader hierher ziehen, um sie für den Spieltag zu nominieren.
        </p>
      )}
    </section>
  )
}
