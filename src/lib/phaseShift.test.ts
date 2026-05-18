import { describe, expect, it } from 'vitest'
import type { Slot } from '../types'
import {
  defaultPhaseShape,
  PRESSING_PRESETS,
  pressingLineY,
  sanitizePhaseShape,
  SHAPE_MAX,
  SHAPE_MIN,
  shapeSlots,
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
    const [s] = shapeSlots([slot({ position: 'LB', x: 14, y: 24 })], { width: 0.6, height: 1 })
    expect(s.x).toBeGreaterThan(14)
    expect(s.x).toBeLessThan(50)
  })

  it('spreizt Spieler bei width > 1 nach außen', () => {
    const [s] = shapeSlots([slot({ position: 'LB', x: 20, y: 24 })], { width: 1.1, height: 1 })
    expect(s.x).toBeLessThan(20)
  })

  it('macht die Mannschaft bei height < 1 kompakter (zieht nach hinten)', () => {
    const [s] = shapeSlots([slot({ position: 'ST', x: 50, y: 82 })], { width: 1, height: 0.6 })
    expect(s.y).toBeLessThan(82)
  })

  it('lässt den Torwart unverändert', () => {
    const [gk] = shapeSlots([slot({ position: 'GK', x: 50, y: 6 })], { width: 0.6, height: 0.6 })
    expect(gk.x).toBe(50)
    expect(gk.y).toBe(6)
  })

  it('klemmt Koordinaten an die Spielfeldränder', () => {
    const [s] = shapeSlots([slot({ position: 'RW', x: 84, y: 80 })], {
      width: SHAPE_MAX,
      height: SHAPE_MAX,
    })
    expect(s.x).toBeLessThanOrEqual(96)
    expect(s.y).toBeLessThanOrEqual(95)
  })

  it('mutiert die Eingabe nicht', () => {
    const input = [slot({ position: 'LB', x: 14, y: 24 })]
    const snapshot = JSON.parse(JSON.stringify(input))
    shapeSlots(input, { width: 0.7, height: 0.8 })
    expect(input).toEqual(snapshot)
  })
})

describe('Phasen-Form-Defaults', () => {
  it('defensiv ist kompakter als offensiv', () => {
    expect(defaultPhaseShape.withoutBall.width).toBeLessThan(defaultPhaseShape.withBall.width)
    expect(defaultPhaseShape.withoutBall.height).toBeLessThan(defaultPhaseShape.withBall.height)
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

  it('Presets: hoch presst höher als tief', () => {
    expect(PRESSING_PRESETS.high.height).toBeGreaterThan(PRESSING_PRESETS.mid.height)
    expect(PRESSING_PRESETS.mid.height).toBeGreaterThan(PRESSING_PRESETS.low.height)
  })
})

describe('sanitizePhaseShape', () => {
  it('klemmt Werte in die erlaubten Grenzen', () => {
    const s = sanitizePhaseShape({ width: 5, height: -1 }, defaultPhaseShape.withBall)
    expect(s.width).toBe(SHAPE_MAX)
    expect(s.height).toBe(SHAPE_MIN)
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
