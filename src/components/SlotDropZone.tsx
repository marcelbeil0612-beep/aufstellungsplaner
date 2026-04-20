import { useDroppable } from '@dnd-kit/core'
import type { Slot } from '../types'
import { PlayerChip } from './PlayerChip'
import { selectPlayerOfSlot, useLineupStore } from '../store/useLineupStore'
import { positionShort } from '../data/positionWeights'

type Props = { slot: Slot }

export function SlotDropZone({ slot }: Props) {
  const player = useLineupStore((s) => selectPlayerOfSlot(s, slot.id))
  const { isOver, setNodeRef, active } = useDroppable({
    id: `slot:${slot.id}`,
    data: { slotId: slot.id, position: slot.position },
  })

  const draggedPlayerRole = (active?.data.current as { role?: 'GK' | 'FIELD' } | undefined)?.role
  const incompatibleDrag =
    isOver &&
    draggedPlayerRole !== undefined &&
    ((slot.position === 'GK' && draggedPlayerRole !== 'GK') ||
      (slot.position !== 'GK' && draggedPlayerRole === 'GK'))

  // y-Achse im SVG: 0 oben, aber wir wollen "eigenes Tor unten" → invertieren.
  const top = `${100 - slot.y}%`
  const left = `${slot.x}%`

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
    >
      <div
        ref={setNodeRef}
        className={[
          'flex flex-col items-center gap-1 rounded-2xl p-1 transition',
          isOver && !incompatibleDrag ? 'bg-white/20 ring-2 ring-white/80' : '',
          incompatibleDrag ? 'bg-rose-500/30 ring-2 ring-rose-400' : '',
        ].join(' ')}
      >
        {player ? (
          <PlayerChip player={player} source={slot.id} positionShort={positionShort[slot.position]} compact />
        ) : (
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/60 bg-white/5 text-[10px] font-bold text-white/80 shadow-md">
            {positionShort[slot.position]}
          </div>
        )}
      </div>
    </div>
  )
}
