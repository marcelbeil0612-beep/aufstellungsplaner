import { useDraggable } from '@dnd-kit/core'
import type { Player } from '../types'
import { initials } from '../lib/photoUtils'

type Props = {
  player: Player
  /** "bench" für Bank, sonst die slotId. Wird zum Unterscheiden der Quelle beim Drop gebraucht. */
  source: string
  /** Optionales Positionskürzel, das auf dem Chip im Feld angezeigt wird. */
  positionShort?: string
  /** Optionaler Score (0-99) für die aktuelle Position – erscheint als Badge rechts oben. */
  score?: number
  compact?: boolean
}

export function PlayerChip({ player, source, positionShort, score, compact }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `player:${player.id}:${source}`,
    data: { playerId: player.id, source, role: player.role },
  })

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {}

  const isGK = player.role === 'GK'
  const ringColor = isGK ? 'ring-amber-400' : 'ring-sky-400'
  const gradient = isGK
    ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800'
    : 'bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-800'

  // Größen: Spieler auf dem Feld deutlich groß für gute Lesbarkeit & Foto-Erkennung.
  const avatarSize = compact ? 'h-16 w-16' : 'h-14 w-14'
  const nameSize = compact ? 'text-[11px]' : 'text-xs'
  const initialsSize = compact ? 'text-lg' : 'text-base'

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        'group flex select-none touch-none flex-col items-center gap-1.5 text-white transition-transform duration-150',
        isDragging ? 'z-50 scale-110 rotate-[2deg] opacity-80' : 'hover:-translate-y-0.5',
      ].join(' ')}
      aria-label={`Spieler ${player.name}`}
    >
      <div className="relative">
        {/* Schlagschatten unter dem Avatar – gibt dem Spieler „Gewicht" auf dem Rasen */}
        <div
          aria-hidden
          className="absolute inset-x-2 bottom-[-4px] h-2 rounded-full bg-black/50 blur-md"
        />
        {positionShort && (
          <span
            className={[
              'absolute -left-1.5 -top-1.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-lg ring-1',
              isGK ? 'bg-amber-500 ring-amber-300/60' : 'bg-sky-600 ring-sky-300/60',
            ].join(' ')}
          >
            {positionShort}
          </span>
        )}
        {typeof score === 'number' && (
          <span
            className={[
              'absolute -right-1.5 -top-1.5 z-10 min-w-[22px] rounded-md px-1.5 py-0.5 text-center text-[11px] font-black shadow-lg ring-1',
              score >= 80 ? 'bg-emerald-500 text-white ring-emerald-300/60' :
              score >= 65 ? 'bg-sky-500 text-white ring-sky-300/60' :
              score >= 50 ? 'bg-amber-500 text-white ring-amber-300/60' :
                            'bg-rose-500 text-white ring-rose-300/60',
            ].join(' ')}
            title="Score auf dieser Position"
          >
            {score.toFixed(0)}
          </span>
        )}
        <div
          className={[
            'relative overflow-hidden rounded-full shadow-xl ring-[3px] ring-offset-2 ring-offset-transparent',
            avatarSize,
            ringColor,
            player.photo ? 'bg-slate-950' : gradient,
          ].join(' ')}
        >
          {player.photo ? (
            <img
              src={player.photo}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center font-black tracking-wide ${initialsSize}`}>
              {initials(player.name)}
            </div>
          )}
          {/* Glanzlicht für Tiefe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent"
          />
        </div>
      </div>
      <span
        className={[
          'max-w-[96px] truncate rounded-md bg-black/70 px-2 py-0.5 font-bold text-white shadow backdrop-blur',
          nameSize,
        ].join(' ')}
      >
        {player.name}
      </span>
    </button>
  )
}
