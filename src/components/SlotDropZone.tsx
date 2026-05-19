import { useDroppable } from '@dnd-kit/core'
import type { Slot } from '../types'
import { PlayerChip } from './PlayerChip'
import { selectPlayerOfSlot, useLineupStore } from '../store/useLineupStore'
import { positionShort } from '../data/positionWeights'
import { playerPositionScore } from '../lib/score'

type Props = {
  slot: Slot
  /** Aktiviert die weichen top/left-Transitions – nur beim Phasenwechsel gesetzt. */
  animating?: boolean
  /** Feldseitiger Größenfaktor (adaptiv bei engem Block, 0.4–1). */
  chipScale?: number
}

export function SlotDropZone({ slot, animating, chipScale = 1 }: Props) {
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
      className={[
        'absolute -translate-x-1/2 -translate-y-1/2',
        animating ? 'transition-[top,left] duration-500 ease-out' : '',
      ].join(' ')}
      style={{ top, left }}
    >
      <div
        ref={setNodeRef}
        className={[
          'flex flex-col items-center gap-1 rounded-2xl p-1 transition',
          isOver && !incompatibleDrag ? 'bg-white/25 ring-2 ring-white/80 shadow-[0_0_20px_rgba(255,255,255,0.45)]' : '',
          incompatibleDrag ? 'bg-rose-500/30 ring-2 ring-rose-400' : '',
        ].join(' ')}
      >
        {player ? (
          <PlayerChip
            player={player}
            source={slot.id}
            positionShort={positionShort[slot.position]}
            score={player.skills ? playerPositionScore(player, slot.position) : undefined}
            compact
            scale={chipScale}
          />
        ) : (
          <div
            style={{
              width: Math.round(56 * Math.max(0.4, Math.min(1, chipScale))),
              height: Math.round(56 * Math.max(0.4, Math.min(1, chipScale))),
            }}
            className="flex flex-col items-center justify-center rounded-full border-2 border-dashed border-white/70 bg-white/10 text-[11px] font-black uppercase tracking-wider text-white/90 shadow-[inset_0_0_15px_rgba(0,0,0,0.25)] backdrop-blur"
          >
            {positionShort[slot.position]}
          </div>
        )}
      </div>
    </div>
  )
}
