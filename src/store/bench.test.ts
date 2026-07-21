import { beforeEach, describe, expect, it } from 'vitest'
import { createJSONStorage } from 'zustand/middleware'
import { formationById } from '../data/formations'
import {
  BENCH_SIZE,
  emptyBench,
  migratePersistedState,
  sanitizeBench,
  selectBenchCount,
  selectReservePlayers,
  useLineupStore,
} from './useLineupStore'

// Im Node-Testlauf gibt es kein IndexedDB; jede Aktion würde beim Persistieren
// eine unbehandelte Rejection werfen. Storage deshalb auf Speicher umhängen –
// getestet wird die Store-Logik, nicht die Persistenzschicht.
const memory = new Map<string, string>()
useLineupStore.persist.setOptions({
  storage: createJSONStorage(() => ({
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value)
    },
    removeItem: (key) => {
      memory.delete(key)
    },
  })),
})

const initial = useLineupStore.getState()
const formation = formationById(initial.formationId)
const fieldSlotId = formation.slots.find((s) => s.position !== 'GK')!.id
const otherFieldSlotId = formation.slots.filter((s) => s.position !== 'GK')[1].id
const gkSlotId = formation.slots.find((s) => s.position === 'GK')!.id

const fieldPlayers = initial.players.filter((p) => p.role === 'FIELD')
const [alpha, beta, gamma] = fieldPlayers
const keeper = initial.players.find((p) => p.role === 'GK')!

beforeEach(() => {
  useLineupStore.setState({
    players: initial.players,
    formationId: initial.formationId,
    assignments: Object.fromEntries(formation.slots.map((s) => [s.id, null])),
    bench: emptyBench(),
    savedLineups: [],
    activeLineupId: null,
    substitutions: [],
  })
})

describe('sanitizeBench', () => {
  it('liefert immer genau BENCH_SIZE Plätze', () => {
    expect(sanitizeBench(undefined)).toHaveLength(BENCH_SIZE)
    expect(sanitizeBench(['a', 'b'])).toHaveLength(BENCH_SIZE)
    expect(sanitizeBench(Array(30).fill('a'))).toHaveLength(BENCH_SIZE)
  })

  it('wirft Nicht-Strings raus und lässt den Platz frei', () => {
    expect(sanitizeBench(['a', 42, null, {}, 'b'])).toEqual([
      'a', null, null, null, 'b', null, null,
    ])
  })

  it('verhindert denselben Spieler auf zwei Plätzen', () => {
    expect(sanitizeBench(['a', 'a', 'b'])).toEqual([
      'a', null, 'b', null, null, null, null,
    ])
  })
})

describe('Migration v12 → v13', () => {
  it('legt eine leere Bank an – live und je gespeicherter Aufstellung', () => {
    const migrated = migratePersistedState(
      { savedLineups: [{ id: 'x', name: 'A', formationId: '4-4-2', assignments: {} }] },
      12,
    )
    expect(migrated.bench).toHaveLength(BENCH_SIZE)
    expect(migrated.bench!.every((seat) => seat === null)).toBe(true)
    expect(migrated.savedLineups![0].bench).toHaveLength(BENCH_SIZE)
  })

  it('rettet eine kaputte persistierte Bank in die kanonische Form', () => {
    const migrated = migratePersistedState({ bench: ['a', 'a', 7] }, 12)
    expect(migrated.bench).toEqual(['a', null, null, null, null, null, null])
  })
})

describe('Bank und Feld sind disjunkt', () => {
  it('wer auf die Bank gesetzt wird, räumt seinen Feld-Slot', () => {
    const { assign, benchAssign } = useLineupStore.getState()
    assign(fieldSlotId, alpha.id)
    expect(useLineupStore.getState().assignments[fieldSlotId]).toBe(alpha.id)

    benchAssign(2, alpha.id)
    const s = useLineupStore.getState()
    expect(s.assignments[fieldSlotId]).toBeNull()
    expect(s.bench[2]).toBe(alpha.id)
  })

  it('wer aufgestellt wird, verlässt die Bank', () => {
    const { assign, benchAssign } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    assign(fieldSlotId, alpha.id)

    const s = useLineupStore.getState()
    expect(s.bench[0]).toBeNull()
    expect(s.assignments[fieldSlotId]).toBe(alpha.id)
  })

  it('das Kader-Reservoir zeigt weder Aufgestellte noch Nominierte', () => {
    const { assign, benchAssign } = useLineupStore.getState()
    assign(fieldSlotId, alpha.id)
    benchAssign(0, beta.id)

    const reserve = selectReservePlayers(useLineupStore.getState()).map((p) => p.id)
    expect(reserve).not.toContain(alpha.id)
    expect(reserve).not.toContain(beta.id)
    expect(reserve).toContain(gamma.id)
  })
})

describe('benchAssign', () => {
  it('tauscht zwei Bankplätze, statt einen Spieler zu verlieren', () => {
    const { benchAssign } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    benchAssign(1, beta.id)
    benchAssign(1, alpha.id)

    const bench = useLineupStore.getState().bench
    expect(bench[1]).toBe(alpha.id)
    expect(bench[0]).toBe(beta.id)
    expect(selectBenchCount(useLineupStore.getState())).toBe(2)
  })

  it('schickt den bisherigen Insassen zurück ins Reservoir', () => {
    const { benchAssign } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    benchAssign(0, beta.id)

    const s = useLineupStore.getState()
    expect(s.bench[0]).toBe(beta.id)
    expect(s.bench.includes(alpha.id)).toBe(false)
    expect(selectReservePlayers(s).map((p) => p.id)).toContain(alpha.id)
  })

  it('nimmt Torhüter auf – die Bank kennt keine Rollen-Sperre', () => {
    useLineupStore.getState().benchAssign(3, keeper.id)
    expect(useLineupStore.getState().bench[3]).toBe(keeper.id)
  })

  it('ignoriert Indizes außerhalb der Bank und unbekannte Spieler', () => {
    const { benchAssign } = useLineupStore.getState()
    benchAssign(BENCH_SIZE, alpha.id)
    benchAssign(-1, alpha.id)
    benchAssign(1.5, alpha.id)
    benchAssign(0, 'gibt-es-nicht')
    expect(useLineupStore.getState().bench).toEqual(emptyBench())
  })
})

describe('benchClear', () => {
  it('leert genau einen Platz', () => {
    const { benchAssign, benchClear } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    benchAssign(1, beta.id)
    benchClear(0)

    const bench = useLineupStore.getState().bench
    expect(bench[0]).toBeNull()
    expect(bench[1]).toBe(beta.id)
  })
})

describe('Aufräumen', () => {
  it('reset leert die Bank mit', () => {
    const { assign, benchAssign, reset } = useLineupStore.getState()
    assign(fieldSlotId, alpha.id)
    benchAssign(0, beta.id)
    reset()
    expect(useLineupStore.getState().bench).toEqual(emptyBench())
  })

  it('ein gelöschter Spieler verschwindet auch von der Bank', async () => {
    const { benchAssign, removePlayer } = useLineupStore.getState()
    benchAssign(4, alpha.id)
    await removePlayer(alpha.id)
    expect(useLineupStore.getState().bench.includes(alpha.id)).toBe(false)
  })

  it('die Auto-Aufstellung nimmt nur die von der Bank, die in die Elf rücken', () => {
    const { benchAssign, applyAutoLineup } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    benchAssign(1, beta.id)

    applyAutoLineup({ [fieldSlotId]: alpha.id, [gkSlotId]: keeper.id })

    const s = useLineupStore.getState()
    expect(s.bench[0]).toBeNull() // alpha steht jetzt auf dem Feld
    expect(s.bench[1]).toBe(beta.id) // beta bleibt nominiert
  })
})

describe('Geteilte Aufstellung importieren', () => {
  it('übernimmt die Bank aus dem Link', () => {
    useLineupStore.getState().applySharedLineup({
      formationId: initial.formationId,
      assignments: [[fieldSlotId, alpha.id]],
      substitutions: [],
      bench: [beta.id, null, gamma.id],
      missingPlayers: [],
    })
    const s = useLineupStore.getState()
    expect(s.bench[0]).toBe(beta.id)
    expect(s.bench[2]).toBe(gamma.id)
    expect(s.bench).toHaveLength(BENCH_SIZE)
  })

  it('lässt niemanden gleichzeitig in der Elf und auf der Bank landen', () => {
    // Handgebauter Link: alpha steht im Feld UND auf Platz 0.
    useLineupStore.getState().applySharedLineup({
      formationId: initial.formationId,
      assignments: [[fieldSlotId, alpha.id]],
      substitutions: [],
      bench: [alpha.id, beta.id],
      missingPlayers: [],
    })
    const s = useLineupStore.getState()
    expect(s.assignments[fieldSlotId]).toBe(alpha.id)
    expect(s.bench[0]).toBeNull()
    expect(s.bench[1]).toBe(beta.id)
  })
})

describe('Gespeicherte Aufstellungen', () => {
  it('speichern und laden bringt dieselbe Bank zurück', () => {
    const { benchAssign, saveAsNewLineup, reset, loadLineup } = useLineupStore.getState()
    benchAssign(0, alpha.id)
    benchAssign(3, beta.id)
    useLineupStore.getState().assign(otherFieldSlotId, gamma.id)

    const id = saveAsNewLineup('Heimspiel')
    reset()
    expect(useLineupStore.getState().bench).toEqual(emptyBench())

    loadLineup(id)
    const s = useLineupStore.getState()
    expect(s.bench[0]).toBe(alpha.id)
    expect(s.bench[3]).toBe(beta.id)
    expect(s.assignments[otherFieldSlotId]).toBe(gamma.id)
  })
})
