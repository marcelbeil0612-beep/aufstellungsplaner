import type { Slot } from '../types'

export type Phase = 'withBall' | 'withoutBall'

/**
 * Form-Parameter einer Phase: relative Breite und Höhe der Mannschaft.
 * 1.0 = neutrale Formationskoordinaten, <1 kompakter, >1 weiter.
 */
export type PhaseShape = { width: number; height: number }

/** Regler-Grenzen (UI + Logik klemmen beide hierauf). */
export const SHAPE_MIN = 0.55
export const SHAPE_MAX = 1.15

/**
 * Defaults bewusst kompakter als die rohen Formationskoordinaten – die
 * Mannschaft soll von Haus aus nicht auseinandergezogen wirken. Mit Ball
 * breiter/höher (offensiv), gegen den Ball enger/tiefer (defensiv); der
 * Mit-/Gegen-Ball-Switch wechselt damit zwischen beiden Ausrichtungen.
 */
export const defaultPhaseShape: Record<Phase, PhaseShape> = {
  withBall: { width: 0.92, height: 0.98 },
  withoutBall: { width: 0.78, height: 0.74 },
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// y-Anker knapp vor dem eigenen Tor: height < 1 zieht die Outfield-Linien
// kompakt nach hinten, height > 1 schiebt sie gestreckt Richtung Gegner.
const Y_ANCHOR = 8

/**
 * Skaliert die Slot-Koordinaten einer Formation gemäß Phasen-Form.
 * Breite um die Mittelachse (x=50), Höhe um einen Anker am eigenen Tor.
 * Der Torwart bleibt fix. Die Eingabe wird nicht mutiert.
 */
export function shapeSlots(slots: Slot[], shape: PhaseShape): Slot[] {
  const w = clamp(shape.width, SHAPE_MIN, SHAPE_MAX)
  const h = clamp(shape.height, SHAPE_MIN, SHAPE_MAX)
  return slots.map((s) => {
    if (s.position === 'GK') return { ...s }
    return {
      ...s,
      x: clamp(50 + (s.x - 50) * w, 4, 96),
      y: clamp(Y_ANCHOR + (s.y - Y_ANCHOR) * h, 5, 95),
    }
  })
}

/** Normalisiert/klemmt eine evtl. unvollständige Form auf gültige Werte. */
export function sanitizePhaseShape(raw: unknown, fallback: PhaseShape): PhaseShape {
  const o = (raw ?? {}) as Partial<PhaseShape>
  const num = (v: unknown, d: number) =>
    typeof v === 'number' && Number.isFinite(v) ? clamp(v, SHAPE_MIN, SHAPE_MAX) : d
  return { width: num(o.width, fallback.width), height: num(o.height, fallback.height) }
}
