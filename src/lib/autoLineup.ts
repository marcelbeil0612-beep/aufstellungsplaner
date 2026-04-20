import type { Formation, Player } from '../types'
import { hungarianMin } from './hungarian'
import { completeness, playerPositionScore } from './score'

export type AutoLineupResult = {
  /** slotId → playerId */
  assignments: Record<string, string>
  /** slotId → Score des zugewiesenen Spielers auf dieser Position (0-99) */
  slotScores: Record<string, number>
  /** Summe der Slot-Scores. */
  totalScore: number
  /** Theoretisches Maximum (alle Slots mit Score 99). */
  maxPossibleScore: number
  /** Spieler-IDs, die nicht auf dem Feld stehen. */
  unassignedPlayerIds: string[]
  /** Spieler-IDs mit noch unvollständigem Profil (auf ihrer zugewiesenen Position). */
  incompletePlayerIds: string[]
}

/**
 * Berechnet die optimale Aufstellung für die angegebene Formation.
 * Torhüter werden separat gelöst (weil nur TW-Rollen zulässig sind), Feldspieler
 * per Hungarian-Algorithmus. Fehlende Skills werden in score.ts mit 50 ersetzt.
 */
export function computeBestLineup(players: Player[], formation: Formation): AutoLineupResult {
  const gkSlots = formation.slots.filter((s) => s.position === 'GK')
  const fieldSlots = formation.slots.filter((s) => s.position !== 'GK')

  const goalkeepers = players.filter((p) => p.role === 'GK')
  const fieldPlayers = players.filter((p) => p.role === 'FIELD')

  const assignments: Record<string, string> = {}
  const slotScores: Record<string, number> = {}
  const incompletePlayerIds = new Set<string>()

  // Torhüter: greedy – höchster Score je Slot, ohne Doppelbelegung
  const usedGk = new Set<string>()
  for (const slot of gkSlots) {
    let best: { player: Player; score: number } | null = null
    for (const gk of goalkeepers) {
      if (usedGk.has(gk.id)) continue
      const s = playerPositionScore(gk, slot.position)
      if (!best || s > best.score) best = { player: gk, score: s }
    }
    if (best) {
      assignments[slot.id] = best.player.id
      slotScores[slot.id] = best.score
      usedGk.add(best.player.id)
      if (completeness(best.player, slot.position) < 1) incompletePlayerIds.add(best.player.id)
    }
  }

  // Feldspieler: Hungarian. Kosten = 100 − Score, damit Minimierung = Max-Score.
  if (fieldSlots.length > 0 && fieldPlayers.length >= fieldSlots.length) {
    const cost: number[][] = fieldSlots.map((slot) =>
      fieldPlayers.map((p) => 100 - playerPositionScore(p, slot.position)),
    )
    const pick = hungarianMin(cost)
    pick.forEach((playerIdx, rowIdx) => {
      if (playerIdx < 0) return
      const slot = fieldSlots[rowIdx]
      const player = fieldPlayers[playerIdx]
      assignments[slot.id] = player.id
      slotScores[slot.id] = 100 - cost[rowIdx][playerIdx]
      if (completeness(player, slot.position) < 1) incompletePlayerIds.add(player.id)
    })
  }

  const totalScore = Object.values(slotScores).reduce((a, b) => a + b, 0)
  const maxPossibleScore = formation.slots.length * 99
  const assignedIds = new Set(Object.values(assignments))
  const unassignedPlayerIds = players.filter((p) => !assignedIds.has(p.id)).map((p) => p.id)

  return {
    assignments,
    slotScores,
    totalScore,
    maxPossibleScore,
    unassignedPlayerIds,
    incompletePlayerIds: Array.from(incompletePlayerIds),
  }
}
