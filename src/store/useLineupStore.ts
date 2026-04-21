import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formationById, formations } from '../data/formations'
import { initialPlayers } from '../data/players'
import type { Phase } from '../lib/phaseShift'
import type { Player, Skills } from '../types'

type Assignments = Record<string, string | null> // slotId → playerId | null

export type SavedLineup = {
  id: string
  name: string
  formationId: string
  assignments: Assignments
  createdAt: number
  updatedAt: number
}

type State = {
  players: Player[]
  formationId: string
  assignments: Assignments
  savedLineups: SavedLineup[]
  /** ID der zuletzt geladenen Aufstellung – dient UI-Hinweisen („Änderungen speichern"). */
  activeLineupId: string | null
  /** Taktische Phase, beeinflusst die Slot-Koordinaten auf dem Feld. */
  phase: Phase
}

type Actions = {
  setFormation: (id: string) => void
  /** Weist einen Spieler einem Slot zu. Wenn der Spieler bereits woanders steht, wird sein alter Slot frei. Wenn der Zielslot belegt ist, wird der vorhandene Spieler getauscht. */
  assign: (slotId: string, playerId: string) => void
  /** Entfernt die Zuordnung eines Slots (Spieler geht zurück auf die Bank). */
  unassign: (slotId: string) => void
  /** Setzt Aufstellung zurück (alle Slots leer, Formation bleibt). */
  reset: () => void

  /** Legt eine neue gespeicherte Aufstellung aus dem aktuellen Zustand an und macht sie aktiv. */
  saveAsNewLineup: (name: string) => string
  /** Überschreibt die gerade aktive gespeicherte Aufstellung mit dem aktuellen Zustand. */
  overwriteActiveLineup: () => void
  /** Lädt eine gespeicherte Aufstellung in den aktuellen Zustand. */
  loadLineup: (id: string) => void
  /** Benennt eine gespeicherte Aufstellung um. */
  renameLineup: (id: string, name: string) => void
  /** Löscht eine gespeicherte Aufstellung. Falls sie aktiv war, wird der Aktiv-Status zurückgesetzt. */
  deleteLineup: (id: string) => void

  /** Setzt / entfernt das Spielerfoto (Data-URL oder null). */
  setPlayerPhoto: (playerId: string, photo: string | null) => void
  /** Aktualisiert einzelne Skill-Werte; undefined im Patch entfernt den Key. */
  updatePlayerSkills: (playerId: string, patch: Partial<Skills>) => void

  /** Wendet eine berechnete Auto-Aufstellung auf die aktuelle Formation an. */
  applyAutoLineup: (assignments: Record<string, string>) => void

  /** Schaltet die taktische Phase direkt oder per Toggle um. */
  setPhase: (phase: Phase) => void
  togglePhase: () => void

  /** Stellt einen zuvor exportierten Snapshot wieder her (alle persistierten Felder). */
  restoreFromBackup: (snapshot: Partial<State>) => void
}

const emptyAssignments = (slotIds: string[]): Assignments =>
  Object.fromEntries(slotIds.map((id) => [id, null]))

const newId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useLineupStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      players: initialPlayers,
      formationId: formations[0].id,
      assignments: emptyAssignments(formations[0].slots.map((s) => s.id)),
      savedLineups: [],
      activeLineupId: null,
      phase: 'withBall',

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
        set({
          assignments: emptyAssignments(formation.slots.map((s) => s.id)),
          activeLineupId: null,
        })
      },

      saveAsNewLineup: (name) => {
        const { formationId, assignments, savedLineups } = get()
        const now = Date.now()
        const lineup: SavedLineup = {
          id: newId(),
          name: name.trim() || formationById(formationId).name,
          formationId,
          assignments: { ...assignments },
          createdAt: now,
          updatedAt: now,
        }
        set({
          savedLineups: [lineup, ...savedLineups],
          activeLineupId: lineup.id,
        })
        return lineup.id
      },

      overwriteActiveLineup: () => {
        const { activeLineupId, formationId, assignments, savedLineups } = get()
        if (!activeLineupId) return
        const idx = savedLineups.findIndex((l) => l.id === activeLineupId)
        if (idx === -1) return
        const updated: SavedLineup = {
          ...savedLineups[idx],
          formationId,
          assignments: { ...assignments },
          updatedAt: Date.now(),
        }
        const next = [...savedLineups]
        next[idx] = updated
        set({ savedLineups: next })
      },

      loadLineup: (id) => {
        const lineup = get().savedLineups.find((l) => l.id === id)
        if (!lineup) return
        const formation = formationById(lineup.formationId)
        // Defensive: vollständige Slot-Map der Formation herstellen, damit keine Slots fehlen,
        // falls sich Formationsdefinitionen ändern.
        const base = emptyAssignments(formation.slots.map((s) => s.id))
        const merged: Assignments = { ...base, ...lineup.assignments }
        set({
          formationId: lineup.formationId,
          assignments: merged,
          activeLineupId: id,
        })
      },

      renameLineup: (id, name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        const next = get().savedLineups.map((l) =>
          l.id === id ? { ...l, name: trimmed, updatedAt: Date.now() } : l,
        )
        set({ savedLineups: next })
      },

      deleteLineup: (id) => {
        const { savedLineups, activeLineupId } = get()
        set({
          savedLineups: savedLineups.filter((l) => l.id !== id),
          activeLineupId: activeLineupId === id ? null : activeLineupId,
        })
      },

      setPlayerPhoto: (playerId, photo) => {
        const next = get().players.map((p) =>
          p.id === playerId ? { ...p, photo: photo ?? undefined } : p,
        )
        set({ players: next })
      },

      updatePlayerSkills: (playerId, patch) => {
        const next = get().players.map((p) => {
          if (p.id !== playerId) return p
          const merged: Skills = { ...(p.skills ?? {}), ...patch }
          for (const k of Object.keys(merged) as Array<keyof Skills>) {
            const v = merged[k]
            if (v === undefined || !Number.isFinite(v)) delete merged[k]
          }
          return { ...p, skills: Object.keys(merged).length > 0 ? merged : undefined }
        })
        set({ players: next })
      },

      applyAutoLineup: (assignments) => {
        const formation = formationById(get().formationId)
        const next = emptyAssignments(formation.slots.map((s) => s.id))
        for (const [slotId, playerId] of Object.entries(assignments)) {
          if (slotId in next) next[slotId] = playerId
        }
        set({ assignments: next, activeLineupId: null })
      },

      setPhase: (phase) => set({ phase }),
      togglePhase: () => set({ phase: get().phase === 'withBall' ? 'withoutBall' : 'withBall' }),

      restoreFromBackup: (snapshot) => {
        const safeFormationId =
          typeof snapshot.formationId === 'string' ? snapshot.formationId : formations[0].id
        const safeAssignments: Assignments =
          snapshot.assignments && typeof snapshot.assignments === 'object'
            ? (snapshot.assignments as Assignments)
            : emptyAssignments(formationById(safeFormationId).slots.map((s) => s.id))
        const safeSavedLineups: SavedLineup[] = Array.isArray(snapshot.savedLineups)
          ? (snapshot.savedLineups as SavedLineup[])
          : []
        const safeActiveId =
          typeof snapshot.activeLineupId === 'string' || snapshot.activeLineupId === null
            ? (snapshot.activeLineupId as string | null)
            : null
        const safePhase: Phase = snapshot.phase === 'withoutBall' ? 'withoutBall' : 'withBall'

        // Spieler-Merge: Code-Kader als Basis, gespeicherte Fotos + Skills drüberlegen.
        // Neue Spieler im Code erscheinen dadurch, bestehende behalten ihre Werte.
        const persistedPlayers = Array.isArray(snapshot.players) ? (snapshot.players as Player[]) : []
        const byId = new Map(persistedPlayers.map((p) => [p.id, p]))
        const mergedPlayers: Player[] = initialPlayers.map((base) => {
          const saved = byId.get(base.id)
          if (!saved) return base
          return { ...base, photo: saved.photo, skills: saved.skills }
        })

        set({
          formationId: safeFormationId,
          assignments: safeAssignments,
          savedLineups: safeSavedLineups,
          activeLineupId: safeActiveId,
          phase: safePhase,
          players: mergedPlayers,
        })
      },
    }),
    {
      name: 'aufstellungsplaner:v1',
      version: 4,
      partialize: (state) => ({
        formationId: state.formationId,
        assignments: state.assignments,
        savedLineups: state.savedLineups,
        activeLineupId: state.activeLineupId,
        players: state.players,
        phase: state.phase,
      }),
      // WICHTIG: Jede künftige Schema-Änderung bekommt hier einen neuen Zweig.
      // Ohne migrate würde Zustand bei Versionssprüngen die persistierten Daten
      // verwerfen – genau der Fehler, der dem Nutzer die Daten schon gekostet hat.
      migrate: (persistedStateUnknown, version) => {
        const s = (persistedStateUnknown ?? {}) as Partial<State>
        // v1 → v2: gespeicherte Aufstellungen + aktive Aufstellung
        if (version < 2) {
          if (!Array.isArray(s.savedLineups)) s.savedLineups = []
          if (!('activeLineupId' in s)) s.activeLineupId = null
        }
        // v2 → v3: Spieler-Liste mit Fotos/Skills (merge ergänzt aus dem Code-Kader)
        if (version < 3) {
          if (!Array.isArray(s.players)) s.players = []
        }
        // v3 → v4: taktische Phase
        if (version < 4) {
          if (s.phase !== 'withBall' && s.phase !== 'withoutBall') {
            s.phase = 'withBall'
          }
        }
        return s
      },
      merge: (persistedStateUnknown, currentState) => {
        // Alte Persistenzen haben evtl. kein players-Feld. Außerdem sollen neu
        // im Code hinzugekommene Spieler (z. B. Neuzugänge) erscheinen, ohne
        // die gespeicherten Fotos/Skills der bestehenden zu verlieren.
        const persisted = (persistedStateUnknown ?? {}) as Partial<State>
        const persistedPlayers = Array.isArray(persisted.players) ? persisted.players : []
        const byId = new Map(persistedPlayers.map((p) => [p.id, p]))

        const mergedPlayers: Player[] = initialPlayers.map((base) => {
          const saved = byId.get(base.id)
          if (!saved) return base
          return {
            ...base,
            photo: saved.photo,
            skills: saved.skills,
            // Name aus dem Code hat Vorrang (Korrekturen in players.ts sollen greifen),
            // kann später via renamePlayer-Action eigenständig werden.
          }
        })

        return {
          ...currentState,
          ...persisted,
          players: mergedPlayers,
        }
      },
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
