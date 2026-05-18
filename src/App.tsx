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
import { ImportShareDialog } from './components/ImportShareDialog'
import { PaywallDialog } from './components/PaywallDialog'
import { PhaseToggle } from './components/PhaseToggle'
import { Pitch } from './components/Pitch'
import { PlayerChipVisual } from './components/PlayerChipVisual'
import { formationById } from './data/formations'
import { positionLabel, positionShort } from './data/positionWeights'
import { downloadLineupPng, suggestedLineupFilename } from './lib/exportLineup'
import { applyPhase } from './lib/phaseShift'
import { playerPositionScore } from './lib/score'
import { buildShareUrl, parseShareHash, type SharePayload } from './lib/shareUrl'
import { useLineupStore } from './store/useLineupStore'

type DragData = {
  playerId: string
  source: string // "bench" oder slotId
  role: 'GK' | 'FIELD'
}
type DropData = { slotId?: string; position?: string; isBench?: boolean }
type ActiveDrag = { playerId: string; source: string }

export default function App() {
  // Default-State ist valide (leere Aufstellung auf 4-4-2) – die App rendert
  // sofort, die IndexedDB-Hydration tauscht die Werte transparent aus, sobald
  // sie fertig ist. Kein Splash, der bei fertiger Hydration hängen bleiben könnte.
  const formationId = useLineupStore((s) => s.formationId)
  const phase = useLineupStore((s) => s.phase)
  const players = useLineupStore((s) => s.players)
  const assignments = useLineupStore((s) => s.assignments)
  const substitutions = useLineupStore((s) => s.substitutions)
  const assign = useLineupStore((s) => s.assign)
  const unassign = useLineupStore((s) => s.unassign)
  const formation = useMemo(() => formationById(formationId), [formationId])
  const [warning, setWarning] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)
  const [exporting, setExporting] = useState(false)
  const [sharePayload, setSharePayload] = useState<SharePayload | null>(null)

  // Beim Mount prüfen, ob ein #share=… Hash anliegt → Import-Dialog öffnen
  // und den Hash aus der URL entfernen, damit Reloads ihn nicht erneut triggern.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const payload = parseShareHash(window.location.hash)
    if (payload) {
      setSharePayload(payload)
      const cleanUrl = window.location.pathname + window.location.search
      window.history.replaceState(null, '', cleanUrl)
    }
  }, [])

  const handleShare = async () => {
    const url = buildShareUrl({
      formationId,
      assignments,
      substitutions,
      players,
      title: formation.name,
    })
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        try {
          await navigator.share({ title: 'Aufstellung', url })
          return
        } catch {
          /* User abgebrochen oder API verweigert – Fallback unten. */
        }
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setNotice('Link kopiert. In WhatsApp/Mail einfügen.')
        window.setTimeout(() => setNotice(null), 2800)
      } else {
        // Letzter Fallback: in das Warning-Banner blenden, damit der Nutzer den Link kopieren kann.
        setWarning(url)
      }
    } catch (e) {
      setWarning(e instanceof Error ? `Teilen fehlgeschlagen: ${e.message}` : 'Teilen fehlgeschlagen.')
      window.setTimeout(() => setWarning(null), 3500)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await downloadLineupPng(
        { formation, phase, assignments, players, title: formation.name },
        suggestedLineupFilename(formation.name),
      )
    } catch (e) {
      setWarning(
        e instanceof Error
          ? `Export fehlgeschlagen: ${e.message}`
          : 'Export fehlgeschlagen.',
      )
      window.setTimeout(() => setWarning(null), 3500)
    } finally {
      setExporting(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 3 } }),
    useSensor(KeyboardSensor),
  )

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
        {notice && (
          <div className="mx-6 mt-4 rounded-lg border border-emerald-500/40 bg-emerald-950/70 px-4 py-2 text-sm text-emerald-200 shadow">
            {notice}
          </div>
        )}

        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row">
          <section className="flex flex-1 flex-col items-center">
            <div className="flex w-full max-w-[480px] flex-col gap-3 pb-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">
                  {formation.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {formation.slots.length} Positionen
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PhaseToggle />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-inner transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Aufstellung als PNG exportieren"
                  >
                    <span aria-hidden>📷</span>
                    <span>{exporting ? 'Export läuft …' : 'Als Bild'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-inner transition hover:bg-slate-800"
                    title="Aufstellung als Link teilen"
                  >
                    <span aria-hidden>🔗</span>
                    <span>Teilen</span>
                  </button>
                </div>
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

      <ImportShareDialog payload={sharePayload} onClose={() => setSharePayload(null)} />
      <PaywallDialog />

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
