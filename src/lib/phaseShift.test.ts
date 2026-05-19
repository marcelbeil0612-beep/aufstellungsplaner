import { describe, expect, it } from 'vitest'
import type { Slot } from '../types'
import {
  defaultPhaseShape,
  effectiveShape,
  HEIGHT_MAX,
  HEIGHT_MIN,
  PRESSING_PRESETS,
  pressingLineY,
  sanitizePhaseShape,
  shapeSlots,
  WIDTH_MAX,
  WITHBALL_HEIGHT,
} from './phaseShift'

const slot = (overrides: Partial<Slot>): Slot => ({
  id: 's',
  position: 'CM',
  x: 50,
  y: 50,
  ...overrides,
})

describe('shapeSlots', () => {
  it('zieht Spieler bei width < 1 zur Mittelachse', () => {
    const [s] = shapeSlots([slot({ position: 'LB', x: 14, y: 24 })], { width: 0.6, height: 0.8 })
    expect(s.x).toBeGreaterThan(14)
    expect(s.x).toBeLessThan(50)
  })

  it('macht die Mannschaft bei kleinerer Höhe kompakter (zieht nach hinten)', () => {
    const [s] = shapeSlots([slot({ position: 'ST', x: 50, y: 82 })], { width: 1, height: 0.6 })
    expect(s.y).toBeLessThan(82)
  })

  it('lässt den Torwart unverändert', () => {
    const [gk] = shapeSlots([slot({ position: 'GK', x: 50, y: 6 })], { width: 0.6, height: 0.6 })
    expect(gk.x).toBe(50)
    expect(gk.y).toBe(6)
  })

  it('überstreckt nie über Strafraumhöhe (y ≤ 82), selbst bei Maximalwerten', () => {
    const [s] = shapeSlots([slot({ position: 'ST', x: 50, y: 92 })], {
      width: WIDTH_MAX,
      height: HEIGHT_MAX,
    })
    expect(s.y).toBeLessThanOrEqual(82)
  })

  it('mutiert die Eingabe nicht', () => {
    const input = [slot({ position: 'LB', x: 14, y: 24 })]
    const snapshot = JSON.parse(JSON.stringify(input))
    shapeSlots(input, { width: 0.7, height: 0.8 })
    expect(input).toEqual(snapshot)
  })
})

describe('effectiveShape', () => {
  it('Mit Ball: Höhe ist fix (kein Regler), Breite wird durchgereicht', () => {
    const e = effectiveShape('withBall', { width: 1.05, height: 0.2 })
    expect(e.height).toBe(WITHBALL_HEIGHT)
    expect(e.width).toBe(1.05)
  })

  it('Gegen den Ball: Höhe wird in die Defensiv-Grenzen geklemmt', () => {
    expect(effectiveShape('withoutBall', { width: 1, height: 5 }).height).toBe(HEIGHT_MAX)
    expect(effectiveShape('withoutBall', { width: 1, height: 0 }).height).toBe(HEIGHT_MIN)
  })
})

describe('Phasen-Form-Defaults', () => {
  it('Mit-Ball-Höhe entspricht der festen Vertikal-Staffelung', () => {
    expect(defaultPhaseShape.withBall.height).toBe(WITHBALL_HEIGHT)
  })
  it('gegen den Ball ist enger gefächert als mit Ball', () => {
    expect(defaultPhaseShape.withoutBall.width).toBeLessThan(defaultPhaseShape.withBall.width)
  })
})

describe('pressingLineY', () => {
  it('nimmt den vordersten Feldspieler, ignoriert den Torwart', () => {
    const slots: Slot[] = [
      slot({ id: 'gk', position: 'GK', y: 6 }),
      slot({ id: 'cb', position: 'CB', y: 22 }),
      slot({ id: 'st', position: 'ST', y: 70 }),
    ]
    expect(pressingLineY(slots)).toBe(70)
  })

  it('Presets: hoch presst höher als tief, alle im kompakten Bereich', () => {
    expect(PRESSING_PRESETS.high.height).toBeGreaterThan(PRESSING_PRESETS.mid.height)
    expect(PRESSING_PRESETS.mid.height).toBeGreaterThan(PRESSING_PRESETS.low.height)
    expect(PRESSING_PRESETS.high.height).toBeLessThanOrEqual(HEIGHT_MAX)
  })
})

describe('sanitizePhaseShape', () => {
  it('klemmt Werte in die jeweiligen Grenzen', () => {
    const s = sanitizePhaseShape({ width: 5, height: -1 }, defaultPhaseShape.withBall)
    expect(s.width).toBe(WIDTH_MAX)
    expect(s.height).toBe(HEIGHT_MIN)
  })

  it('fällt bei ungültigen Werten auf den Fallback zurück', () => {
    const s = sanitizePhaseShape({ width: 'x' }, defaultPhaseShape.withoutBall)
    expect(s).toEqual(defaultPhaseShape.withoutBall)
  })

  it('akzeptiert gültige Werte unverändert', () => {
    const s = sanitizePhaseShape({ width: 0.9, height: 0.8 }, defaultPhaseShape.withBall)
    expect(s).toEqual({ width: 0.9, height: 0.8 })
  })
})
