import type { Slot } from '../types'

export type Phase = 'withBall' | 'withoutBall'

/**
 * Gespeicherte Form je Phase. `width` = Fächerung (Regler). `height` =
 * nur defensiv genutzt: Block-Position (Pressinghöhe), 0.55–0.95.
 * Die Linien-Kompaktheit ist NICHT nutzergesteuert, sondern je Phase
 * fest (Trainer-Wunsch: durchgängig eng, unabhängig von der Höhe).
 */
export type PhaseShape = { width: number; height: number }

/** Intern: aufgelöste Form, die `shapeSlots` konsumiert. */
type EffectiveShape = { width: number; frontY: number; k: number }

export const WIDTH_MIN = 0.55
export const WIDTH_MAX = 1.15

// Defensiv-Positions-Regler (Pressinghöhe) – Wertebereich des `height`-
// Speicherfelds; wird auf eine Front-Linie (frontY) abgebildet.
export const HEIGHT_MIN = 0.55
export const HEIGHT_MAX = 0.95

// Linien-Kompaktheit (Abstand Abwehr↔MF↔Angriff) FEST je Phase.
// Kleiner = enger. Mit Ball „deutlich enger", gegen den Ball „sehr eng".
// Moderate Enge-Obergrenze: eng genug für einen klaren Block, aber so,
// dass die (adaptiv verkleinerten) Chips sich nicht stapeln.
const K_ATTACK = 0.56
const K_DEFENSE = 0.47

// Front-Linie (vorderster Feldspieler) in y-Einheiten (0 eigenes Tor →
// 100 Gegnertor). Y_MAX = Höhe des gegnerischen Strafraums (Deckel).
const FRONT_ATTACK = 80
const FRONT_LOW = 44 // tiefstes Abwehrpressing
const FRONT_HIGH = 80 // höchstes Angriffspressing
const Y_MAX = 82

export const defaultPhaseShape: Record<Phase, PhaseShape> = {
  withBall: { width: 0.95, height: 0.95 },
  withoutBall: { width: 0.78, height: 0.75 },
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/** Defensiver Positions-Wert (0.55–0.95) → Front-Linie y. */
function heightToFrontY(h: number): number {
  const t = (clamp(h, HEIGHT_MIN, HEIGHT_MAX) - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN)
  return FRONT_LOW + t * (FRONT_HIGH - FRONT_LOW)
}

/**
 * Pressinghöhen = Positions-Presets (verschieben den ganzen Block, NICHT
 * die Linien-Enge). `height` so gewählt, dass heightToFrontY hoch/mittel/
 * tief ergibt.
 */
export type PressingHeight = 'high' | 'mid' | 'low'
export const PRESSING_PRESETS: Record<PressingHeight, { label: string; height: number }> = {
  high: { label: 'Angriffspressing', height: 0.95 },
  mid: { label: 'Mittelfeldpressing', height: 0.75 },
  low: { label: 'Abwehrpressing', height: 0.58 },
}

export const PRESSING_ZONE_DEPTH = 24

/**
 * Auflösung der gespeicherten Form je Phase:
 * – Mit Ball: feste offensive Front + feste (deutlich enge) Kompaktheit,
 *   nur Breite nutzergesteuert.
 * – Gegen den Ball: Front aus Pressinghöhe, feste (sehr enge)
 *   Kompaktheit, Breite nutzergesteuert.
 */
export function effectiveShape(phase: Phase, stored: PhaseShape): EffectiveShape {
  const width = clamp(stored.width, WIDTH_MIN, WIDTH_MAX)
  if (phase === 'withBall') return { width, frontY: FRONT_ATTACK, k: K_ATTACK }
  return { width, frontY: heightToFrontY(stored.height), k: K_DEFENSE }
}

/**
 * Setzt die Slots: Breite um die Mittelachse skaliert; vertikal wird der
 * vorderste Feldspieler auf `frontY` gelegt und alle dahinterliegenden
 * Linien mit Faktor `k` herangezogen (konstante Enge, unabhängig von der
 * Front-Position). Torwart bleibt fix. Eingabe wird nicht mutiert.
 */
export function shapeSlots(slots: Slot[], eff: EffectiveShape): Slot[] {
  const outfield = slots.filter((s) => s.position !== 'GK')
  const maxBaseY = outfield.length ? Math.max(...outfield.map((s) => s.y)) : 100
  const w = clamp(eff.width, WIDTH_MIN, WIDTH_MAX)
  return slots.map((s) => {
    if (s.position === 'GK') return { ...s }
    return {
      ...s,
      x: clamp(50 + (s.x - 50) * w, 4, 96),
      y: clamp(eff.frontY - (maxBaseY - s.y) * eff.k, 5, Y_MAX),
    }
  })
}

/** y des vordersten Feldspielers (= frontY) – für die Störer-Linie. */
export function pressingLineY(slots: Slot[]): number {
  const ys = slots.filter((s) => s.position !== 'GK').map((s) => s.y)
  return ys.length ? Math.max(...ys) : 50
}

/** Normalisiert/klemmt eine evtl. unvollständige gespeicherte Form. */
export function sanitizePhaseShape(raw: unknown, fallback: PhaseShape): PhaseShape {
  const o = (raw ?? {}) as Partial<PhaseShape>
  const num = (v: unknown, d: number, min: number, max: number) =>
    typeof v === 'number' && Number.isFinite(v) ? clamp(v, min, max) : d
  return {
    width: num(o.width, fallback.width, WIDTH_MIN, WIDTH_MAX),
    height: num(o.height, fallback.height, HEIGHT_MIN, HEIGHT_MAX),
  }
}
