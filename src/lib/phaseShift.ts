import type { Position, Slot } from '../types'

export type Phase = 'withBall' | 'withoutBall'

/**
 * Verschiebungen je Position relativ zur neutralen Formation.
 * `dx` positiv = nach rechts, `dy` positiv = nach vorne Richtung gegnerisches Tor.
 *
 * Grundidee:
 * - Mit Ball: Linien rücken auf, Außenverteidiger schieben hoch und bleiben breit,
 *   Zehner/CAM kippt Richtung Sturm, Stürmer suchen die Box.
 * - Gegen den Ball: Block kompakt, Außen rücken nach innen, Flügel tucken,
 *   Stürmer fallen zurück zur ersten Pressing-Linie.
 */
const offsets: Record<Position, Record<Phase, [number, number]>> = {
  GK:  { withBall: [ 0,  3], withoutBall: [ 0,  0] },
  CB:  { withBall: [ 0,  4], withoutBall: [ 0, -2] },
  LB:  { withBall: [-4, 12], withoutBall: [ 6, -4] },
  RB:  { withBall: [ 4, 12], withoutBall: [-6, -4] },
  LWB: { withBall: [-2, 12], withoutBall: [ 8, -10] },
  RWB: { withBall: [ 2, 12], withoutBall: [-8, -10] },
  CDM: { withBall: [ 0,  5], withoutBall: [ 0, -3] },
  CM:  { withBall: [ 0,  6], withoutBall: [ 0, -5] },
  CAM: { withBall: [ 0, 10], withoutBall: [ 0, -8] },
  LM:  { withBall: [-2,  7], withoutBall: [ 4, -5] },
  RM:  { withBall: [ 2,  7], withoutBall: [-4, -5] },
  LW:  { withBall: [-2,  4], withoutBall: [ 8, -6] },
  RW:  { withBall: [ 2,  4], withoutBall: [-8, -6] },
  ST:  { withBall: [ 0,  4], withoutBall: [ 0, -10] },
  CF:  { withBall: [ 0,  4], withoutBall: [ 0, -8] },
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/** Wendet die Phasenverschiebung auf die Slots einer Formation an. */
export function applyPhase(slots: Slot[], phase: Phase): Slot[] {
  return slots.map((s) => {
    const [dx, dy] = offsets[s.position][phase]
    return {
      ...s,
      x: clamp(s.x + dx, 4, 96),
      y: clamp(s.y + dy, 5, 95),
    }
  })
}

export const phaseLabel: Record<Phase, string> = {
  withBall: 'Mit Ball',
  withoutBall: 'Gegen den Ball',
}
