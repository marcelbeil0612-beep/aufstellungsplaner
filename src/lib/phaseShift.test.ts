import { describe, expect, it } from 'vitest'
import type { Slot } from '../types'
import { applyPhase } from './phaseShift'

const slot = (overrides: Partial<Slot>): Slot => ({
  id: 's',
  position: 'CM',
  x: 50,
  y: 50,
  ...overrides,
})

describe('applyPhase', () => {
  it('verschiebt Spieler bei „Mit Ball" nach vorn', () => {
    const [shifted] = applyPhase([slot({ position: 'CAM', y: 60 })], 'withBall')
    expect(shifted.y).toBeGreaterThan(60)
  })

  it('zieht Spieler bei „Gegen den Ball" zurück', () => {
    const [shifted] = applyPhase([slot({ position: 'ST', y: 80 })], 'withoutBall')
    expect(shifted.y).toBeLessThan(80)
  })

  it('clamped Slots an die Spielfeldränder', () => {
    // Stürmer an der gegnerischen Torlinie würde sonst über y=100 hinausschießen.
    const [shifted] = applyPhase([slot({ position: 'ST', x: 50, y: 95 })], 'withBall')
    expect(shifted.y).toBeLessThanOrEqual(95)
    expect(shifted.y).toBeGreaterThanOrEqual(5)
  })

  it('mutiert die Eingabe nicht', () => {
    const input = [slot({ position: 'LB', x: 14, y: 24 })]
    const snapshot = JSON.parse(JSON.stringify(input))
    applyPhase(input, 'withBall')
    expect(input).toEqual(snapshot)
  })

  it('hat keine Verschiebung für GK gegen den Ball (Default-Position)', () => {
    const [shifted] = applyPhase([slot({ position: 'GK', x: 50, y: 6 })], 'withoutBall')
    expect(shifted.x).toBe(50)
    expect(shifted.y).toBe(6)
  })
})
