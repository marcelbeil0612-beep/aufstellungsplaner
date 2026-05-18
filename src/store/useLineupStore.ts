import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formationById, formations } from '../data/formations'
import { initialPlayers } from '../data/players'
import type { SystemId } from '../data/tacticBook'
import { defaultPhaseShape, sanitizePhaseShape, type Phase, type PhaseShape } from '../lib/phaseShift'
import type { ShareMatchResult } from '../lib/shareUrl'
import type { Match, Player, PlayerStatus, Position, Role, Skills, Substitution } from '../types'
import { lineupStorage } from './idbStorage'
import { newPhotoId, usePhotoStore } from './photoStore'

type Assignments = Record<string, string | null> // slotId → playerId | null

export type SavedLineup = {
  id: string
  name: string
  formationId: string
  assignments: Assignments
  /** Geplante Auswechslungen für diese Aufstellung. */
  substitutions: Substitution[]
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
  /**
   * Form (Breite/Höhe) je Phase. Der Mit-/Gegen-Ball-Switch wechselt
   * zwischen offensiver und defensiver Ausrichtung. Nutzergesteuert –
   * ersetzt die früher fest verdrahtete Phasen-Verschiebung.
   */
  phaseShape: Record<Phase, PhaseShape>
  /** Zuletzt betrachtetes Duell, damit der Dialog bei Öffnen dort weitermacht. */
  lastViewedDuel: { our: SystemId; opp: SystemId } | null
  /**
   * Wird true, sobald der Nutzer die Spielerliste aktiv geändert hat
   * (add/remove/rename). Ab dann ist die persistierte Liste autoritativ;
   * der Code-Default-Kader wird beim Merge nicht mehr drüberkopiert.
   */
  playerListIsUserManaged: boolean
  /** Live geplante Auswechslungen für die aktuelle Aufstellung. */
  substitutions: Substitution[]
  /** Spielprotokoll: chronologische Liste gespielter Matches. */
  matches: Match[]
  /**
   * Pro-Freischaltung. Lokal pro Gerät persistiert (Offline-Karenz für die
   * spätere Lizenz-Validierung), bewusst NICHT Teil von Backup-Export/Import
   * – sonst ließe sich Pro durch Teilen einer JSON-Datei umgehen.
   */
  isPro: boolean
  /**
   * Signierter Pro-Lizenz-Token (oder null). Lokal/Backup-portierbar
   * (das ist der legitime „Kauf wiederherstellen“-Weg, kryptografisch
   * gebunden). `isPro` wird daraus abgeleitet, nicht roh übertragen.
   */
  license: string | null
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

  /**
   * Speichert oder entfernt das Spielerfoto. Der Blob wandert in den
   * separaten Photo-IDB-Store (siehe `photoStore.ts`); im Spieler-State
   * bleibt nur die `photoId`.
   */
  setPlayerPhoto: (playerId: string, blob: Blob | null) => Promise<void>
  /** Aktualisiert einzelne Skill-Werte; undefined im Patch entfernt den Key. */
  updatePlayerSkills: (playerId: string, patch: Partial<Skills>) => void
  /** Setzt oder löscht die Trikotnummer (1–99). */
  setPlayerNumber: (playerId: string, number: number | null) => void
  /** Setzt oder löscht den Verfügbarkeitsstatus (undefined = verfügbar). */
  setPlayerStatus: (playerId: string, status: PlayerStatus | null) => void
  /** Setzt die Stammpositionen des Spielers (leeres Array = keine Bevorzugung). */
  setPlayerPreferredPositions: (playerId: string, positions: Position[]) => void
  /** Fügt einen neuen Spieler hinzu. Setzt `playerListIsUserManaged` auf true. */
  addPlayer: (name: string, role: Role) => void
  /**
   * Entfernt einen Spieler. Räumt sämtliche Slot-Zuordnungen (aktuell + in
   * allen gespeicherten Aufstellungen) und das ggf. hinterlegte Foto auf.
   */
  removePlayer: (playerId: string) => Promise<void>
  /** Benennt einen Spieler um. */
  renamePlayer: (playerId: string, name: string) => void

  /** Fügt eine leere Auswechsel-Zeile hinzu und gibt die neue ID zurück. */
  addSubstitution: () => string
  /** Aktualisiert eine bestehende Auswechslung (Patch-Style). */
  updateSubstitution: (id: string, patch: Partial<Omit<Substitution, 'id'>>) => void
  /** Entfernt eine geplante Auswechslung. */
  removeSubstitution: (id: string) => void
  /** Löscht den gesamten Wechselplan der aktuellen Aufstellung. */
  clearSubstitutions: () => void

  /** Legt einen neuen Spielprotokoll-Eintrag an und gibt die ID zurück. */
  addMatch: (
    init: Pick<Match, 'date' | 'opponent'> & Partial<Omit<Match, 'id' | 'date' | 'opponent' | 'createdAt' | 'updatedAt'>>,
  ) => string
  /** Aktualisiert einen Eintrag (Patch). updatedAt wird automatisch gesetzt. */
  updateMatch: (id: string, patch: Partial<Omit<Match, 'id' | 'createdAt' | 'updatedAt'>>) => void
  /** Entfernt einen Spielprotokoll-Eintrag. */
  removeMatch: (id: string) => void

  /** Wendet eine berechnete Auto-Aufstellung auf die aktuelle Formation an. */
  applyAutoLineup: (assignments: Record<string, string>) => void

  /**
   * Importiert eine geteilte Aufstellung (Match-Result aus `lib/shareUrl.ts`)
   * als neue gespeicherte Aufstellung und macht sie aktiv. Gibt die ID zurück.
   */
  applySharedLineup: (match: ShareMatchResult) => string

  /** Schaltet die taktische Phase direkt oder per Toggle um. */
  setPhase: (phase: Phase) => void
  togglePhase: () => void

  /** Passt die Form (Breite/Höhe) der angegebenen Phase an. */
  setPhaseShape: (phase: Phase, patch: Partial<PhaseShape>) => void

  /** Stellt einen zuvor exportierten Snapshot wieder her (alle persistierten Felder). */
  restoreFromBackup: (snapshot: Partial<State>) => void

  /** Systembuch: zuletzt betrachtetes Duell merken. */
  setLastViewedDuel: (duel: { our: SystemId; opp: SystemId } | null) => void

  /**
   * Setzt den Pro-Freischalt-Status. Wird später von der Lizenz-Validierung
   * (P4) gesetzt; vorerst der einzige Schreibpfad auf `isPro`.
   */
  setProStatus: (isPro: boolean) => void

  /** Setzt den Lizenz-Token (oder null) – persistiert. */
  setLicense: (token: string | null) => void
}

const emptyAssignments = (slotIds: string[]): Assignments =>
  Object.fromEntries(slotIds.map((id) => [id, null]))

const newId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/**
 * Aktuelle Schema-Version des persistierten Stores. Wird sowohl von der
 * Zustand-`persist`-Konfiguration als auch von `lib/backup.ts` gelesen, damit
 * Backups die Version mitschreiben und beim Import durch dieselbe Migrations-
 * Kette wie der reguläre Persist-Pfad laufen können.
 */
export const STORE_VERSION = 11

/**
 * Reine Migrationsfunktion. Wird sowohl im `persist({ migrate })`-Hook als auch
 * beim Backup-Import (`importBackupFile`) verwendet, damit ein älteres Backup
 * dieselben Migrationen durchläuft wie eine alte lokale Persistenz.
 */
export function migratePersistedState(
  raw: unknown,
  fromVersion: number,
): Partial<State> {
  const s = (raw ?? {}) as Partial<State>
  // v1 → v2: gespeicherte Aufstellungen + aktive Aufstellung
  if (fromVersion < 2) {
    if (!Array.isArray(s.savedLineups)) s.savedLineups = []
    if (!('activeLineupId' in s)) s.activeLineupId = null
  }
  // v2 → v3: Spieler-Liste mit Fotos/Skills (merge ergänzt aus dem Code-Kader)
  if (fromVersion < 3) {
    if (!Array.isArray(s.players)) s.players = []
  }
  // v3 → v4: taktische Phase
  if (fromVersion < 4) {
    if (s.phase !== 'withBall' && s.phase !== 'withoutBall') {
      s.phase = 'withBall'
    }
  }
  // v4 → v5: Systembuch-Status (tacticBookView wurde später entfernt; lastViewedDuel bleibt)
  if (fromVersion < 5) {
    if (!('lastViewedDuel' in s)) s.lastViewedDuel = null
  }
  // v5 → v6: Spielerliste kann jetzt vom Nutzer verwaltet werden (CRUD).
  // Bestehende Installationen starten mit false – ihre Liste wird weiterhin
  // mit dem Code-Default gemergt, bis sie zum ersten Mal aktiv editiert wird.
  if (fromVersion < 6) {
    if (typeof s.playerListIsUserManaged !== 'boolean') s.playerListIsUserManaged = false
  }
  // v6 → v7: Auswechselplan, live + pro gespeicherter Aufstellung.
  if (fromVersion < 7) {
    if (!Array.isArray(s.substitutions)) s.substitutions = []
    if (Array.isArray(s.savedLineups)) {
      s.savedLineups = s.savedLineups.map((l) =>
        Array.isArray(l.substitutions) ? l : { ...l, substitutions: [] },
      )
    }
  }
  // v7 → v8: Spielprotokoll.
  if (fromVersion < 8) {
    if (!Array.isArray(s.matches)) s.matches = []
  }
  // v8 → v9: Pro-Freischalt-Status. Bestehende Installationen starten frei.
  if (fromVersion < 9) {
    if (typeof s.isPro !== 'boolean') s.isPro = false
  }
  // v9 → v10: nutzergesteuerte Form je Phase (ersetzt feste phaseShift-Tabelle).
  if (fromVersion < 10) {
    const raw = (s.phaseShape ?? {}) as Partial<Record<Phase, PhaseShape>>
    s.phaseShape = {
      withBall: sanitizePhaseShape(raw.withBall, defaultPhaseShape.withBall),
      withoutBall: sanitizePhaseShape(raw.withoutBall, defaultPhaseShape.withoutBall),
    }
  }
  // v10 → v11: Pro-Lizenz-Token (signiert). Bestehende ohne Lizenz.
  if (fromVersion < 11) {
    if (typeof s.license !== 'string') s.license = null
  }
  return s
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
      phaseShape: {
        withBall: { ...defaultPhaseShape.withBall },
        withoutBall: { ...defaultPhaseShape.withoutBall },
      },
      lastViewedDuel: null,
      playerListIsUserManaged: false,
      substitutions: [],
      matches: [],
      isPro: false,
      license: null,

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
        const { assignments, formationId, players } = get()
        const formation = formationById(formationId)
        const slot = formation.slots.find((s) => s.id === slotId)
        if (!slot) return
        const player = players.find((p) => p.id === playerId)
        if (!player) return
        // Defense-in-depth: die UI verhindert GK/Feld-Mismatches bereits beim
        // Drag, aber programmatische Aufrufe (Backup-Import mit kaputten
        // Assignments, künftige Features) könnten die Invariante sonst brechen.
        const isGkSlot = slot.position === 'GK'
        const isGkPlayer = player.role === 'GK'
        if (isGkSlot !== isGkPlayer) return

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
          substitutions: [],
        })
      },

      saveAsNewLineup: (name) => {
        const { formationId, assignments, substitutions, savedLineups } = get()
        const now = Date.now()
        const lineup: SavedLineup = {
          id: newId(),
          name: name.trim() || formationById(formationId).name,
          formationId,
          assignments: { ...assignments },
          substitutions: substitutions.map((s) => ({ ...s })),
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
        const { activeLineupId, formationId, assignments, substitutions, savedLineups } = get()
        if (!activeLineupId) return
        const idx = savedLineups.findIndex((l) => l.id === activeLineupId)
        if (idx === -1) return
        const updated: SavedLineup = {
          ...savedLineups[idx],
          formationId,
          assignments: { ...assignments },
          substitutions: substitutions.map((s) => ({ ...s })),
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
          substitutions: (lineup.substitutions ?? []).map((s) => ({ ...s })),
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
        const { savedLineups, activeLineupId, matches } = get()
        set({
          savedLineups: savedLineups.filter((l) => l.id !== id),
          activeLineupId: activeLineupId === id ? null : activeLineupId,
          // Spielprotokoll-Einträge dürfen nicht auf ein gelöschtes Lineup zeigen.
          matches: matches.map((m) =>
            m.lineupId === id ? { ...m, lineupId: undefined } : m,
          ),
        })
      },

      setPlayerPhoto: async (playerId, blob) => {
        const player = get().players.find((p) => p.id === playerId)
        if (!player) return
        const photoStore = usePhotoStore.getState()

        if (blob === null) {
          if (player.photoId) await photoStore.remove(player.photoId)
          set({
            players: get().players.map((p) =>
              p.id === playerId ? { ...p, photoId: undefined, photo: undefined } : p,
            ),
          })
          return
        }

        // Neue photoId für jeden Upload: macht „Foto ersetzen" trivial und vermeidet
        // Race-Conditions, falls zwei schnelle Uploads denselben Blob-Key überschreiben würden.
        const oldId = player.photoId
        const newId = newPhotoId()
        await photoStore.put(newId, blob)
        if (oldId) await photoStore.remove(oldId)
        set({
          players: get().players.map((p) =>
            p.id === playerId ? { ...p, photoId: newId, photo: undefined } : p,
          ),
        })
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

      setPlayerNumber: (playerId, number) => {
        const next = get().players.map((p) => {
          if (p.id !== playerId) return p
          if (number === null || !Number.isFinite(number)) return { ...p, number: undefined }
          const clamped = Math.max(1, Math.min(99, Math.trunc(number)))
          return { ...p, number: clamped }
        })
        set({ players: next })
      },

      setPlayerStatus: (playerId, status) => {
        const next = get().players.map((p) =>
          p.id === playerId ? { ...p, status: status ?? undefined } : p,
        )
        set({ players: next })
      },

      setPlayerPreferredPositions: (playerId, positions) => {
        // Duplikate raus, GK-Slot bei Feldspielern raus, Sortierung deterministisch.
        const cleaned = Array.from(new Set(positions))
        const next = get().players.map((p) => {
          if (p.id !== playerId) return p
          const filtered = p.role === 'GK' ? cleaned : cleaned.filter((pos) => pos !== 'GK')
          return {
            ...p,
            preferredPositions: filtered.length > 0 ? filtered : undefined,
          }
        })
        set({ players: next })
      },

      addPlayer: (name, role) => {
        const trimmed = name.trim()
        if (!trimmed) return
        const player: Player = { id: newId(), name: trimmed, role }
        set({
          players: [...get().players, player],
          playerListIsUserManaged: true,
        })
      },

      removePlayer: async (playerId) => {
        const player = get().players.find((p) => p.id === playerId)
        if (!player) return

        // Foto-Blob mit aufräumen, sonst bleibt eine verwaiste Datei im Photo-IDB liegen.
        if (player.photoId) {
          await usePhotoStore.getState().remove(player.photoId)
        }

        const cleanAssignments = (a: Assignments): Assignments => {
          const next: Assignments = {}
          for (const [slotId, pid] of Object.entries(a)) {
            next[slotId] = pid === playerId ? null : pid
          }
          return next
        }

        set({
          players: get().players.filter((p) => p.id !== playerId),
          assignments: cleanAssignments(get().assignments),
          savedLineups: get().savedLineups.map((l) => ({
            ...l,
            assignments: cleanAssignments(l.assignments),
          })),
          playerListIsUserManaged: true,
        })
      },

      renamePlayer: (playerId, name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set({
          players: get().players.map((p) =>
            p.id === playerId ? { ...p, name: trimmed } : p,
          ),
          playerListIsUserManaged: true,
        })
      },

      addSubstitution: () => {
        const sub: Substitution = {
          id: newId(),
          outPlayerId: '',
          inPlayerId: '',
        }
        set({ substitutions: [...get().substitutions, sub] })
        return sub.id
      },

      updateSubstitution: (id, patch) => {
        set({
          substitutions: get().substitutions.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        })
      },

      removeSubstitution: (id) => {
        set({ substitutions: get().substitutions.filter((s) => s.id !== id) })
      },

      clearSubstitutions: () => {
        set({ substitutions: [] })
      },

      addMatch: (init) => {
        const now = Date.now()
        const match: Match = {
          id: newId(),
          date: init.date,
          opponent: init.opponent,
          lineupId: init.lineupId,
          ourGoals: init.ourGoals,
          oppGoals: init.oppGoals,
          venue: init.venue,
          notes: init.notes,
          createdAt: now,
          updatedAt: now,
        }
        set({ matches: [match, ...get().matches] })
        return match.id
      },

      updateMatch: (id, patch) => {
        set({
          matches: get().matches.map((m) =>
            m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m,
          ),
        })
      },

      removeMatch: (id) => {
        set({ matches: get().matches.filter((m) => m.id !== id) })
      },

      applyAutoLineup: (assignments) => {
        const formation = formationById(get().formationId)
        const next = emptyAssignments(formation.slots.map((s) => s.id))
        for (const [slotId, playerId] of Object.entries(assignments)) {
          if (slotId in next) next[slotId] = playerId
        }
        // Auswechslungen sind plan-spezifisch – nach kompletter Umstellung
        // sind sie i. d. R. nicht mehr passend.
        set({ assignments: next, activeLineupId: null, substitutions: [] })
      },

      applySharedLineup: (match) => {
        const formation = formationById(match.formationId)
        const next = emptyAssignments(formation.slots.map((s) => s.id))
        for (const [slotId, playerId] of match.assignments) {
          if (slotId in next) next[slotId] = playerId
        }
        const subs: Substitution[] = match.substitutions.map((s) => ({
          id: newId(),
          minute: s.minute,
          outPlayerId: s.outPlayerId,
          inPlayerId: s.inPlayerId,
          note: s.note,
        }))
        const now = Date.now()
        const name =
          match.title?.trim() ||
          `Geteilt · ${formation.name} · ${new Date(now).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
          })}`
        const lineup: SavedLineup = {
          id: newId(),
          name,
          formationId: match.formationId,
          assignments: next,
          substitutions: subs,
          createdAt: now,
          updatedAt: now,
        }
        set({
          formationId: match.formationId,
          assignments: next,
          substitutions: subs,
          savedLineups: [lineup, ...get().savedLineups],
          activeLineupId: lineup.id,
        })
        return lineup.id
      },

      setPhase: (phase) => set({ phase }),
      togglePhase: () => set({ phase: get().phase === 'withBall' ? 'withoutBall' : 'withBall' }),

      setPhaseShape: (phase, patch) => {
        const current = get().phaseShape
        const next = sanitizePhaseShape({ ...current[phase], ...patch }, defaultPhaseShape[phase])
        set({ phaseShape: { ...current, [phase]: next } })
      },

      restoreFromBackup: (snapshot) => {
        const safeFormationId =
          typeof snapshot.formationId === 'string' ? snapshot.formationId : formations[0].id
        const safeAssignments: Assignments =
          snapshot.assignments && typeof snapshot.assignments === 'object'
            ? (snapshot.assignments as Assignments)
            : emptyAssignments(formationById(safeFormationId).slots.map((s) => s.id))
        // Saved lineups defensiv durchreichen + ggf. fehlende substitutions[] nachziehen.
        const safeSavedLineups: SavedLineup[] = Array.isArray(snapshot.savedLineups)
          ? (snapshot.savedLineups as SavedLineup[]).map((l) => ({
              ...l,
              substitutions: Array.isArray(l.substitutions) ? l.substitutions : [],
            }))
          : []
        const safeActiveId =
          typeof snapshot.activeLineupId === 'string' || snapshot.activeLineupId === null
            ? (snapshot.activeLineupId as string | null)
            : null
        const safePhase: Phase = snapshot.phase === 'withoutBall' ? 'withoutBall' : 'withBall'
        const rawShape = (snapshot.phaseShape ?? {}) as Partial<Record<Phase, PhaseShape>>
        const safePhaseShape: Record<Phase, PhaseShape> = {
          withBall: sanitizePhaseShape(rawShape.withBall, defaultPhaseShape.withBall),
          withoutBall: sanitizePhaseShape(rawShape.withoutBall, defaultPhaseShape.withoutBall),
        }
        const safeLicense = typeof snapshot.license === 'string' ? snapshot.license : null
        const safeSubstitutions: Substitution[] = Array.isArray(snapshot.substitutions)
          ? (snapshot.substitutions as Substitution[])
          : []
        const safeMatches: Match[] = Array.isArray(snapshot.matches)
          ? (snapshot.matches as Match[])
          : []

        // Wenn das Backup aus einer Installation kommt, in der der Nutzer den
        // Kader aktiv verwaltet hat, ist die persistierte Liste autoritativ.
        // Sonst (Default-Kader unverändert) bleibt das bisherige Merge-Verhalten.
        const persistedPlayers = Array.isArray(snapshot.players) ? (snapshot.players as Player[]) : []
        const userManaged = snapshot.playerListIsUserManaged === true
        let mergedPlayers: Player[]
        if (userManaged) {
          mergedPlayers = persistedPlayers
        } else {
          const byId = new Map(persistedPlayers.map((p) => [p.id, p]))
          mergedPlayers = initialPlayers.map((base) => {
            const saved = byId.get(base.id)
            if (!saved) return base
            return {
              ...base,
              photo: saved.photo,
              photoId: saved.photoId,
              skills: saved.skills,
              number: saved.number,
              status: saved.status,
              preferredPositions: saved.preferredPositions,
            }
          })
        }

        // `isPro` wird bewusst NICHT aus dem Snapshot übernommen: Pro-
        // Entitlement darf nicht über eine geteilte Backup-Datei wandern.
        // Der aktuelle Gerätestatus bleibt unverändert.
        set({
          formationId: safeFormationId,
          assignments: safeAssignments,
          savedLineups: safeSavedLineups,
          activeLineupId: safeActiveId,
          phase: safePhase,
          phaseShape: safePhaseShape,
          license: safeLicense,
          players: mergedPlayers,
          playerListIsUserManaged: userManaged,
          substitutions: safeSubstitutions,
          matches: safeMatches,
        })
      },

      setLastViewedDuel: (duel) => set({ lastViewedDuel: duel }),

      setProStatus: (isPro) => set({ isPro }),

      setLicense: (token) => set({ license: token }),
    }),
    {
      name: 'aufstellungsplaner:v1',
      version: STORE_VERSION,
      // IndexedDB statt localStorage: höheres Quota, auf iOS stabiler, kein
      // ITP-7-Tage-Auslauf. Die Storage-Schicht migriert bestehende Daten
      // beim ersten Lesen einmalig aus dem alten localStorage-Eintrag.
      storage: lineupStorage,
      partialize: (state) => ({
        formationId: state.formationId,
        assignments: state.assignments,
        savedLineups: state.savedLineups,
        activeLineupId: state.activeLineupId,
        players: state.players,
        phase: state.phase,
        phaseShape: state.phaseShape,
        lastViewedDuel: state.lastViewedDuel,
        playerListIsUserManaged: state.playerListIsUserManaged,
        substitutions: state.substitutions,
        matches: state.matches,
        isPro: state.isPro,
        license: state.license,
      }),
      migrate: (persistedStateUnknown, version) =>
        migratePersistedState(persistedStateUnknown, version),
      merge: (persistedStateUnknown, currentState) => {
        const persisted = (persistedStateUnknown ?? {}) as Partial<State>
        const persistedPlayers = Array.isArray(persisted.players) ? persisted.players : []

        // Sobald der Nutzer den Kader aktiv editiert hat, ist die persistierte
        // Liste autoritativ – Neuzugänge in players.ts erscheinen ab dem Punkt
        // nicht mehr automatisch (sonst wäre das vom Nutzer Gelöschte wieder da).
        let mergedPlayers: Player[]
        if (persisted.playerListIsUserManaged === true) {
          mergedPlayers = persistedPlayers
        } else {
          const byId = new Map(persistedPlayers.map((p) => [p.id, p]))
          mergedPlayers = initialPlayers.map((base) => {
            const saved = byId.get(base.id)
            if (!saved) return base
            return {
              ...base,
              photo: saved.photo,
              photoId: saved.photoId,
              skills: saved.skills,
              number: saved.number,
              status: saved.status,
              preferredPositions: saved.preferredPositions,
            }
          })
        }

        return {
          ...currentState,
          ...persisted,
          players: mergedPlayers,
        }
      },
    },
  ),
)

/**
 * Async-Hydration-Status: true, sobald die Daten aus IndexedDB geladen sind.
 * Während der kurzen Hydration-Phase steht nur der Default-State zur Verfügung;
 * die UI zeigt solange einen kleinen Splash, damit keine "leere Kader"-Illusion
 * entsteht.
 */
export const hasHydratedStore = (): boolean => useLineupStore.persist.hasHydrated()

/** Subscribe-Helfer: ruft cb einmal, sobald die Hydration abgeschlossen ist. */
export const onStoreHydrated = (cb: () => void): (() => void) =>
  useLineupStore.persist.onFinishHydration(cb)

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
