import type { Slot } from '../types'

export type Phase = 'withBall' | 'withoutBall'

/**
 * Form-Parameter einer Phase: relative Breite und Höhe der Mannschaft.
 * 1.0 = neutrale Formationskoordinaten, <1 kompakter.
 */
export type PhaseShape = { width: number; height: number }

/** Breiten-Regler-Grenzen. */
export const WIDTH_MIN = 0.55
export const WIDTH_MAX = 1.15

/**
 * Höhen-Grenzen bewusst eng: selbst maximal gepresst bleibt die
 * Mannschaft kompakt – der vorderste Spieler darf nie über Höhe des
 * gegnerischen Strafraums hinausgezogen werden.
 */
export const HEIGHT_MIN = 0.55
export const HEIGHT_MAX = 0.95

/**
 * Feste Vertikal-Staffelung „Mit Ball“ (offensiv): realistische, gleich
 * große Abstände. Mit Ball gibt es bewusst KEINEN Höhe-Regler – dort
 * zählt nur die Breite (wie weit wir fächern).
 */
export const WITHBALL_HEIGHT = 0.95

/** y-Obergrenze: Höhe des gegnerischen Strafraums (kein Überstrecken). */
const Y_MAX = 82

/** Defaults: Mit Ball breit & fest gestaffelt, gegen den Ball enger/tiefer. */
export const defaultPhaseShape: Record<Phase, PhaseShape> = {
  withBall: { width: 0.95, height: WITHBALL_HEIGHT },
  withoutBall: { width: 0.78, height: 0.78 },
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// y-Anker knapp vor dem eigenen Tor: kleineres height = kompakter/tiefer.
const Y_ANCHOR = 8

/**
 * Liefert die tatsächlich anzuwendende Form je Phase:
 * – Mit Ball: Höhe fix (kein Regler), nur Breite nutzergesteuert.
 * – Gegen den Ball: Breite + Höhe (Pressinghöhe) nutzergesteuert.
 */
export function effectiveShape(phase: Phase, stored: PhaseShape): PhaseShape {
  const width = clamp(stored.width, WIDTH_MIN, WIDTH_MAX)
  if (phase === 'withBall') return { width, height: WITHBALL_HEIGHT }
  return { width, height: clamp(stored.height, HEIGHT_MIN, HEIGHT_MAX) }
}

/**
 * Skaliert die Slot-Koordinaten gemäß Form. Breite um die Mittelachse,
 * Höhe um einen Anker am eigenen Tor, hart auf Strafraumhöhe geklemmt.
 * Torwart bleibt fix. Eingabe wird nicht mutiert.
 */
export function shapeSlots(slots: Slot[], shape: PhaseShape): Slot[] {
  const w = clamp(shape.width, WIDTH_MIN, WIDTH_MAX)
  const h = clamp(shape.height, HEIGHT_MIN, HEIGHT_MAX)
  return slots.map((s) => {
    if (s.position === 'GK') return { ...s }
    return {
      ...s,
      x: clamp(50 + (s.x - 50) * w, 4, 96),
      y: clamp(Y_ANCHOR + (s.y - Y_ANCHOR) * h, 5, Y_MAX),
    }
  })
}

/**
 * Pressinghöhen für die Defensivphase (Presets des Höhe-Reglers).
 * Alle im kompakten Bereich – auch „hoch“ stretcht nicht unrealistisch.
 */
export type PressingHeight = 'high' | 'mid' | 'low'

export const PRESSING_PRESETS: Record<
  PressingHeight,
  { label: string; height: number }
> = {
  high: { label: 'Angriffspressing', height: 0.95 },
  mid: { label: 'Mittelfeldpressing', height: 0.78 },
  low: { label: 'Abwehrpressing', height: 0.6 },
}

/** Tiefe der Pressingzone (in y-Einheiten 0–100) hinter dem ersten Störer. */
export const PRESSING_ZONE_DEPTH = 24

/**
 * y des vordersten Feldspielers = Linie des ersten Störers. Der Torwart
 * zählt nicht. Leeres/GK-only Input → Mittellinie als Fallback.
 */
export function pressingLineY(slots: Slot[]): number {
  const ys = slots.filter((s) => s.position !== 'GK').map((s) => s.y)
  return ys.length ? Math.max(...ys) : 50
}

/** Normalisiert/klemmt eine evtl. unvollständige Form auf gültige Werte. */
export function sanitizePhaseShape(raw: unknown, fallback: PhaseShape): PhaseShape {
  const o = (raw ?? {}) as Partial<PhaseShape>
  const num = (v: unknown, d: number, min: number, max: number) =>
    typeof v === 'number' && Number.isFinite(v) ? clamp(v, min, max) : d
  return {
    width: num(o.width, fallback.width, WIDTH_MIN, WIDTH_MAX),
    height: num(o.height, fallback.height, HEIGHT_MIN, HEIGHT_MAX),
  }
}
