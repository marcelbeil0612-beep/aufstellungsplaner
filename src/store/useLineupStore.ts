import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formationById, formations } from '../data/formations'
import { initialPlayers } from '../data/players'
import type { Player } from '../types'

type Assignments = Record<string, string | null> // slotId → playerId | null

type State = {
  players: Player[]
  formationId: string
  assignments: Assignments
}

type Actions = {
  setFormation: (id: string) => void
  /** Weist einen Spieler einem Slot zu. Wenn der Spieler bereits woanders steht, wird sein alter Slot frei. Wenn der Zielslot belegt ist, wird der vorhandene Spieler getauscht. */
  assign: (slotId: string, playerId: string) => void
  /** Entfernt die Zuordnung eines Slots (Spieler geht zurück auf die Bank). */
  unassign: (slotId: string) => void
  /** Setzt Aufstellung zurück (alle Slots leer, Formation bleibt). */
  reset: () => void
}

const emptyAssignments = (slotIds: string[]): Assignments =>
  Object.fromEntries(slotIds.map((id) => [id, null]))

export const useLineupStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      players: initialPlayers,
      formationId: formations[0].id,
      assignments: emptyAssignments(formations[0].slots.map((s) => s.id)),

      setFormation: (id) => {
        const oldFormation = formationById(get().formationId)
        const newFormation = formationById(id)
        const oldAssignments = get().assignments

        const next = emptyAssignments(newFormation.slots.map((s) => s.id))
        const usedPlayers = new Set<string>()

        // Versuche Spieler per positionsgleichem Slot zu übernehmen.
        for (const newSlot of newFormation.slots) {
          const matchingOldSlot = oldFormation.slots.find(
            (os) =>
              os.position === newSlot.position &&
              oldAssignments[os.id] &&
              !usedPlayers.has(oldAssignments[os.id]!) &&
              !Object.values(next).includes(oldAssignments[os.id]),
          )
          if (matchingOldSlot) {
            const pid = oldAssignments[matchingOldSlot.id]!
            next[newSlot.id] = pid
            usedPlayers.add(pid)
          }
        }

        set({ formationId: id, assignments: next })
      },

      assign: (slotId, playerId) => {
        const { assignments, formationId } = get()
        const formation = formationById(formationId)
        if (!formation.slots.some((s) => s.id === slotId)) return

        const next: Assignments = { ...assignments }

        // Wenn Spieler bereits woanders steht → alten Slot leeren (bzw. tauschen).
        const currentSlotOfPlayer = Object.entries(next).find(([, pid]) => pid === playerId)?.[0]
        const existingInTarget = next[slotId]

        if (currentSlotOfPlayer && currentSlotOfPlayer !== slotId) {
          // Tausch: der bisherige Bewohner des Ziels wandert auf den alten Slot (oder in den Nirvana, wenn leer).
          next[currentSlotOfPlayer] = existingInTarget ?? null
        }
        next[slotId] = playerId

        set({ assignments: next })
      },

      unassign: (slotId) => {
        const { assignments } = get()
        if (!(slotId in assignments)) return
        set({ assignments: { ...assignments, [slotId]: null } })
      },

      reset: () => {
        const formation = formationById(get().formationId)
        set({ assignments: emptyAssignments(formation.slots.map((s) => s.id)) })
      },
    }),
    {
      name: 'aufstellungsplaner:v1',
      partialize: (state) => ({
        formationId: state.formationId,
        assignments: state.assignments,
      }),
    },
  ),
)

/** Liefert Spieler, die aktuell keinem Slot zugewiesen sind. */
export const selectBenchPlayers = (s: State): Player[] => {
  const assigned = new Set(Object.values(s.assignments).filter(Boolean) as string[])
  return s.players.filter((p) => !assigned.has(p.id))
}

/** Liefert den Spieler, der dem Slot zugewiesen ist (oder undefined). */
export const selectPlayerOfSlot = (s: State, slotId: string): Player | undefined => {
  const pid = s.assignments[slotId]
  return pid ? s.players.find((p) => p.id === pid) : undefined
}
