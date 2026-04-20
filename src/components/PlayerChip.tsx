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
  const ring = isGK ? 'ring-amber-400' : 'ring-sky-400'
  const fallbackBg = isGK
    ? 'bg-gradient-to-br from-amber-500 to-amber-700'
    : 'bg-gradient-to-br from-sky-500 to-indigo-700'
  const avatarSize = compact ? 'h-11 w-11 text-xs' : 'h-14 w-14 text-sm'
  const nameSize = compact ? 'text-[10px]' : 'text-xs'

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        'group flex select-none touch-none flex-col items-center gap-1 text-white transition',
        isDragging ? 'z-50 scale-105 opacity-70' : 'hover:brightness-110',
      ].join(' ')}
      aria-label={`Spieler ${player.name}`}
    >
      <div className="relative">
        {positionShort && (
          <span className="absolute -left-1 -top-1 z-10 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            {positionShort}
          </span>
        )}
        {typeof score === 'number' && (
          <span
            className={[
              'absolute -right-1 -top-1 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-bold shadow ring-1',
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
            'overflow-hidden rounded-full shadow-lg ring-2',
            avatarSize,
            ring,
            player.photo ? 'bg-slate-800' : fallbackBg,
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
            <div className="flex h-full w-full items-center justify-center font-bold">
              {initials(player.name)}
            </div>
          )}
        </div>
      </div>
      <span
        className={[
          'max-w-[80px] truncate rounded-md bg-black/60 px-1.5 py-0.5 font-semibold text-white shadow-sm',
          nameSize,
        ].join(' ')}
      >
        {player.name}
      </span>
    </button>
  )
}
