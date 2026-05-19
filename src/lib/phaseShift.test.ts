import { describe, expect, it } from 'vitest'
import type { Slot } from '../types'
import {
  defaultPhaseShape,
  effectiveShape,
  HEIGHT_MAX,
  PRESSING_PRESETS,
  pressingLineY,
  sanitizePhaseShape,
  shapeSlots,
  WIDTH_MAX,
} from './phaseShift'

const slot = (o: Partial<Slot>): Slot => ({ id: 's', position: 'CM', x: 50, y: 50, ...o })

describe('shapeSlots', () => {
  const eff = (p: Partial<{ width: number; frontY: number; k: number }> = {}) => ({
    width: 1,
    frontY: 80,
    k: 0.5,
    ...p,
  })

  it('legt den vordersten Feldspieler auf frontY', () => {
    const [st] = shapeSlots([slot({ position: 'ST', y: 85 })], eff({ frontY: 78 }))
    expect(st.y).toBeCloseTo(78)
  })

  it('zieht dahinterliegende Linien mit Faktor k heran (Enge)', () => {
    const slots = [slot({ id: 'st', position: 'ST', y: 85 }), slot({ id: 'cb', position: 'CB', y: 25 })]
    const [st, cb] = shapeSlots(slots, eff({ frontY: 80, k: 0.5 }))
    // Linien-Abstand = Basis-Abstand * k
    expect(st.y - cb.y).toBeCloseTo((85 - 25) * 0.5)
  })

  it('kleineres k = engere Linien', () => {
    const slots = [slot({ id: 'st', position: 'ST', y: 85 }), slot({ id: 'cb', position: 'CB', y: 25 })]
    const tight = shapeSlots(slots, eff({ k: 0.35 }))
    const loose = shapeSlots(slots, eff({ k: 0.6 }))
    expect(tight[0].y - tight[1].y).toBeLessThan(loose[0].y - loose[1].y)
  })

  it('width < 1 zieht zur Mittelachse', () => {
    const [s] = shapeSlots([slot({ position: 'LB', x: 14, y: 24 })], eff({ width: 0.6 }))
    expect(s.x).toBeGreaterThan(14)
    expect(s.x).toBeLessThan(50)
  })

  it('Torwart bleibt unverändert', () => {
    const [gk] = shapeSlots([slot({ position: 'GK', x: 50, y: 6 })], eff())
    expect(gk.x).toBe(50)
    expect(gk.y).toBe(6)
  })

  it('klemmt y ≤ 82 (Strafraumhöhe)', () => {
    const [s] = shapeSlots([slot({ position: 'ST', y: 85 })], eff({ frontY: 999 }))
    expect(s.y).toBeLessThanOrEqual(82)
  })

  it('mutiert die Eingabe nicht', () => {
    const input = [slot({ position: 'LB', x: 14, y: 24 })]
    const snap = JSON.parse(JSON.stringify(input))
    shapeSlots(input, eff())
    expect(input).toEqual(snap)
  })
})

describe('effectiveShape', () => {
  it('Gegen den Ball ist enger gestaffelt als Mit Ball (kleineres k)', () => {
    const atk = effectiveShape('withBall', defaultPhaseShape.withBall)
    const def = effectiveShape('withoutBall', defaultPhaseShape.withoutBall)
    expect(def.k).toBeLessThan(atk.k)
  })

  it('Mit Ball: feste offensive Front, Breite durchgereicht', () => {
    const e = effectiveShape('withBall', { width: 1.05, height: 0.2 })
    expect(e.width).toBe(1.05)
    expect(e.frontY).toBeGreaterThan(70)
  })

  it('Gegen den Ball: höhere Pressinghöhe → höhere Front-Linie', () => {
    const hi = effectiveShape('withoutBall', { width: 1, height: HEIGHT_MAX })
    const lo = effectiveShape('withoutBall', { width: 1, height: 0.55 })
    expect(hi.frontY).toBeGreaterThan(lo.frontY)
  })
})

describe('Pressing-Presets (Positions-Presets)', () => {
  it('hoch steht höher als tief', () => {
    expect(PRESSING_PRESETS.high.height).toBeGreaterThan(PRESSING_PRESETS.mid.height)
    expect(PRESSING_PRESETS.mid.height).toBeGreaterThan(PRESSING_PRESETS.low.height)
    const f = (h: number) => effectiveShape('withoutBall', { width: 1, height: h }).frontY
    expect(f(PRESSING_PRESETS.high.height)).toBeGreaterThan(f(PRESSING_PRESETS.low.height))
  })
})

describe('pressingLineY', () => {
  it('nimmt den vordersten Feldspieler, ignoriert den Torwart', () => {
    expect(
      pressingLineY([
        slot({ id: 'gk', position: 'GK', y: 6 }),
        slot({ id: 'cb', position: 'CB', y: 22 }),
        slot({ id: 'st', position: 'ST', y: 70 }),
      ]),
    ).toBe(70)
  })
})

describe('sanitizePhaseShape', () => {
  it('klemmt in die jeweiligen Grenzen', () => {
    const s = sanitizePhaseShape({ width: 9, height: -1 }, defaultPhaseShape.withBall)
    expect(s.width).toBe(WIDTH_MAX)
    expect(s.height).toBe(0.55)
  })
  it('fällt bei ungültigen Werten auf den Fallback zurück', () => {
    expect(sanitizePhaseShape({ width: 'x' }, defaultPhaseShape.withoutBall)).toEqual(
      defaultPhaseShape.withoutBall,
    )
  })
})
