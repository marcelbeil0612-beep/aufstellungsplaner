import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useEffect, useMemo, useState } from 'react'
import { Bench } from './components/Bench'
import { Header } from './components/Header'
import { IOSInstallHint } from './components/IOSInstallHint'
import { PhaseToggle } from './components/PhaseToggle'
import { Pitch } from './components/Pitch'
import { PlayerChipVisual } from './components/PlayerChipVisual'
import { formationById } from './data/formations'
import { positionLabel, positionShort } from './data/positionWeights'
import { applyPhase } from './lib/phaseShift'
import { playerPositionScore } from './lib/score'
import { hasHydratedStore, onStoreHydrated, useLineupStore } from './store/useLineupStore'

/** Kurzer Splash während der asynchronen IndexedDB-Hydration. */
function LoadingSplash() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-slate-950 text-slate-300">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
        <p className="text-sm">Aufstellung wird geladen …</p>
      </div>
    </div>
  )
}

type DragData = {
  playerId: string
  source: string // "bench" oder slotId
  role: 'GK' | 'FIELD'
}
type DropData = { slotId?: string; position?: string; isBench?: boolean }
type ActiveDrag = { playerId: string; source: string }

export default function App() {
  const [hydrated, setHydrated] = useState(() => hasHydratedStore())
  useEffect(() => {
    if (hydrated) return
    setHydrated(hasHydratedStore())
    return onStoreHydrated(() => setHydrated(true))
  }, [hydrated])

  const formationId = useLineupStore((s) => s.formationId)
  const phase = useLineupStore((s) => s.phase)
  const players = useLineupStore((s) => s.players)
  const assign = useLineupStore((s) => s.assign)
  const unassign = useLineupStore((s) => s.unassign)
  const formation = useMemo(() => formationById(formationId), [formationId])
  const [warning, setWarning] = useState<string | null>(null)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)

  // Etwas reaktivere Touch-Aktivierung: 80 ms Halten statt 120 ms, Toleranz 3 px
  // statt 5 px – Drag startet früher, ohne versehentlich beim Tippen zu triggern.
  // WICHTIG: diese Sensor-Hooks MÜSSEN vor einer konditionalen Rückgabe stehen,
  // sonst verletzt es die Rules of Hooks (Hook-Anzahl zwischen Rendern inkonsistent).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 3 } }),
    useSensor(KeyboardSensor),
  )

  if (!hydrated) return <LoadingSplash />

  const onDragStart = (e: DragStartEvent) => {
    const data = e.active.data.current as DragData | undefined
    if (data) setActiveDrag({ playerId: data.playerId, source: data.source })
  }

  const onDragCancel = (_: DragCancelEvent) => {
    setActiveDrag(null)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null)
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

  // Für den DragOverlay: Spieler und – falls aus einem Slot gezogen – der
  // dortige Score werden 1 : 1 mitvisualisiert, damit die schwebende
  // Darstellung identisch mit dem Ursprung ist.
  const activePlayer = activeDrag
    ? players.find((p) => p.id === activeDrag.playerId) ?? null
    : null
  const activeSlot = activeDrag && activeDrag.source !== 'bench'
    ? applyPhase(formation.slots, phase).find((s) => s.id === activeDrag.source)
    : undefined
  const overlayScore = activePlayer && activeSlot && activePlayer.skills
    ? playerPositionScore(activePlayer, activeSlot.position)
    : undefined

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="flex min-h-[100svh] flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <IOSInstallHint />

        {warning && (
          <div className="mx-6 mt-4 rounded-lg border border-rose-500/40 bg-rose-950/70 px-4 py-2 text-sm text-rose-200 shadow">
            {warning}
          </div>
        )}

        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
          <section className="flex flex-1 flex-col items-center">
            <div className="flex w-full max-w-[480px] flex-col gap-3 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {formation.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {formation.slots.length} Positionen
                </p>
              </div>
              <div className="flex justify-center sm:justify-start">
                <PhaseToggle />
              </div>
            </div>
            <Pitch formation={formation} />
            <div className="mt-3 flex w-full max-w-[480px] flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
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

        <footer
          className="border-t border-slate-800 px-6 py-3 text-center text-[11px] text-slate-500"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
        >
          Aufstellung, Fotos & Skills werden im Browser gespeichert · Beste-Aufstellung-Rechner per Skill-Score
        </footer>
      </div>

      {/* Schwebender Chip beim Drag – kein Overflow-Clipping, kein Transform-Kampf. */}
      <DragOverlay
        dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        zIndex={100}
        style={{ willChange: 'transform', cursor: 'grabbing' }}
      >
        {activePlayer && (
          <PlayerChipVisual
            player={activePlayer}
            compact
            positionShort={activeSlot ? positionShort[activeSlot.position] : undefined}
            score={overlayScore}
            elevated
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
