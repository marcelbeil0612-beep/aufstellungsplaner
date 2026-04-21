import { useDraggable } from '@dnd-kit/core'
import type { Player } from '../types'
import { PlayerChipVisual } from './PlayerChipVisual'

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

/**
 * Drag-fähiger Spieler-Chip. Während des Ziehens wird der *Original*-Chip fast
 * komplett ausgeblendet (die sichtbare Bewegung übernimmt der `DragOverlay` in
 * `App.tsx`). Dadurch gibt es keinen Transform-Kampf mit den Slot-Transitions
 * und kein Subpixel-Zittern durch Rotation.
 */
export function PlayerChip({ player, source, positionShort, score, compact }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player:${player.id}:${source}`,
    data: { playerId: player.id, source, role: player.role },
  })

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'select-none touch-none transition-[opacity,transform] duration-100 ease-out',
        isDragging ? 'opacity-15' : 'hover:-translate-y-0.5',
      ].join(' ')}
      aria-label={`Spieler ${player.name}`}
    >
      <PlayerChipVisual
        player={player}
        positionShort={positionShort}
        score={score}
        compact={compact}
      />
    </button>
  )
}
