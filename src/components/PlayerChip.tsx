import { useDraggable } from '@dnd-kit/core'
import type { Player } from '../types'

type Props = {
  player: Player
  /** "bench" für Bank, sonst die slotId. Wird zum Unterscheiden der Quelle beim Drop gebraucht. */
  source: string
  /** Optionales Positionskürzel, das auf dem Chip im Feld angezeigt wird. */
  positionShort?: string
  compact?: boolean
}

export function PlayerChip({ player, source, positionShort, compact }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `player:${player.id}:${source}`,
    data: { playerId: player.id, source, role: player.role },
  })

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {}

  const isGK = player.role === 'GK'
  const ring = isGK ? 'ring-amber-400/60' : 'ring-sky-400/50'
  const bg = isGK
    ? 'bg-gradient-to-br from-amber-500 to-amber-700'
    : 'bg-gradient-to-br from-sky-500 to-indigo-700'

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={[
        'select-none touch-none flex items-center gap-2 rounded-xl px-3 py-2',
        'text-white shadow-lg ring-1 transition',
        bg,
        ring,
        isDragging ? 'opacity-60 scale-105 shadow-2xl z-50' : 'hover:brightness-110',
        compact ? 'text-xs' : 'text-sm',
      ].join(' ')}
      aria-label={`Spieler ${player.name}`}
    >
      {positionShort && (
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          {positionShort}
        </span>
      )}
      <span className="font-semibold">{player.name}</span>
    </button>
  )
}
