import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import { Bench } from './components/Bench'
import { Header } from './components/Header'
import { Pitch } from './components/Pitch'
import { formationById } from './data/formations'
import { positionLabel } from './data/positionWeights'
import { useLineupStore } from './store/useLineupStore'

type DragData = {
  playerId: string
  source: string // "bench" oder slotId
  role: 'GK' | 'FIELD'
}
type DropData = { slotId?: string; position?: string; isBench?: boolean }

export default function App() {
  const formationId = useLineupStore((s) => s.formationId)
  const formation = useMemo(() => formationById(formationId), [formationId])
  const assign = useLineupStore((s) => s.assign)
  const unassign = useLineupStore((s) => s.unassign)
  const [warning, setWarning] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  )

  const onDragEnd = (e: DragEndEvent) => {
    const data = e.active.data.current as DragData | undefined
    const target = e.over?.data.current as DropData | undefined
    if (!data || !target) return

    if (target.isBench) {
      if (data.source !== 'bench') unassign(data.source)
      return
    }
    if (target.slotId) {
      const slotPosition = target.position
      const isGkSlot = slotPosition === 'GK'
      const isGkPlayer = data.role === 'GK'
      if (isGkSlot !== isGkPlayer) {
        setWarning(
          isGkSlot
            ? 'Auf den Torwart-Slot darf nur ein Torhüter.'
            : 'Torhüter dürfen nicht als Feldspieler aufgestellt werden.',
        )
        window.setTimeout(() => setWarning(null), 2500)
        return
      }
      assign(target.slotId, data.playerId)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />

        {warning && (
          <div className="mx-6 mt-4 rounded-lg border border-rose-500/40 bg-rose-950/70 px-4 py-2 text-sm text-rose-200 shadow">
            {warning}
          </div>
        )}

        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
          <section className="flex-1">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg font-semibold text-white">
                {formation.name}
              </h2>
              <p className="text-xs text-slate-500">
                {formation.slots.length} Positionen
              </p>
            </div>
            <Pitch formation={formation} />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Legende:</span>
              {Array.from(new Set(formation.slots.map((s) => s.position))).map((pos) => (
                <span key={pos}>{positionLabel[pos]}</span>
              ))}
            </div>
          </section>
          <div className="w-full lg:w-[360px] lg:flex-shrink-0">
            <Bench />
          </div>
        </main>

        <footer className="border-t border-slate-800 px-6 py-3 text-center text-[11px] text-slate-500">
          Aufstellung wird im Browser gespeichert · Phase 2 folgt: Skill-Bewertungen & beste Aufstellung automatisch
        </footer>
      </div>
    </DndContext>
  )
}
