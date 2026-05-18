import { describe, expect, it } from 'vitest'
import { DEMO_HASH, demoExportInput, demoLineup, isDemoHash } from './demoLineup'
import { formationById } from './formations'

describe('isDemoHash', () => {
  it('erkennt den Demo-Hash mit und ohne führendes #', () => {
    expect(isDemoHash('#demo')).toBe(true)
    expect(isDemoHash('demo')).toBe(true)
    expect(DEMO_HASH).toBe('#demo')
  })

  it('ist nicht für Share-Hashes oder Leer-Hash aktiv', () => {
    expect(isDemoHash('')).toBe(false)
    expect(isDemoHash('#share=abc')).toBe(false)
    expect(isDemoHash('#demoX')).toBe(false)
  })
})

describe('demoLineup · Integrität', () => {
  const formation = formationById(demoLineup.formationId)

  it('Formation ist auflösbar und entspricht der erwarteten ID', () => {
    expect(formation.id).toBe(demoLineup.formationId)
  })

  it('jeder Slot der Formation ist genau einmal besetzt', () => {
    const slotIds = formation.slots.map((s) => s.id).sort()
    const assignedSlots = Object.keys(demoLineup.assignments).sort()
    expect(assignedSlots).toEqual(slotIds)
    expect(assignedSlots).toHaveLength(11)
  })

  it('alle zugewiesenen Spieler existieren und haben einen Namen', () => {
    const byId = new Map(demoLineup.players.map((p) => [p.id, p]))
    for (const pid of Object.values(demoLineup.assignments)) {
      const p = byId.get(pid)
      expect(p).toBeDefined()
      expect(p!.name.trim().length).toBeGreaterThan(0)
    }
  })

  it('keine doppelten Spieler-IDs, kein Spieler doppelt aufgestellt', () => {
    const ids = demoLineup.players.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    const used = Object.values(demoLineup.assignments)
    expect(new Set(used).size).toBe(used.length)
  })

  it('GK-Slot trägt einen Torwart, alle übrigen sind Feldspieler', () => {
    const byId = new Map(demoLineup.players.map((p) => [p.id, p]))
    for (const slot of formation.slots) {
      const player = byId.get(demoLineup.assignments[slot.id])!
      if (slot.position === 'GK') expect(player.role).toBe('GK')
      else expect(player.role).toBe('FIELD')
    }
  })
})

describe('demoExportInput', () => {
  it('liefert deterministisches Render-Input für renderLineupPng', () => {
    const a = demoExportInput()
    const b = demoExportInput()
    expect(a.formation.id).toBe('4-3-3')
    expect(a.shape).toEqual(b.shape)
    expect(typeof a.shape.width).toBe('number')
    expect(a.title).toBe(demoLineup.title)
    expect(a.assignments).toEqual(b.assignments)
    expect(a.players).toEqual(b.players)
  })
})
