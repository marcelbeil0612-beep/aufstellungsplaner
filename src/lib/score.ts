import { fieldWeights, gkWeights } from '../data/positionWeights'
import type { Player, Position, Skills } from '../types'

/** Neutraler Ersatzwert für fehlende Skill-Einträge, damit Spieler mit teilbefülltem
 * Profil nicht automatisch mit Score 0 herausfallen. Wird transparent in der UI
 * kommuniziert („fehlende Werte mit 50 ergänzt"). */
export const DEFAULT_SKILL = 50

/**
 * Score-Bonus, wenn ein Feldspieler auf einer seiner Stammpositionen steht.
 * Größenordnung bewusst klein: bricht Patt-Situationen in der Auto-Aufstellung,
 * verdrängt aber keinen klar besser passenden Spieler.
 */
export const PREFERRED_POSITION_BONUS = 5

/** Skills, die in der Positions-Score-Formel für Feldspieler verwendet werden. */
export const fieldSkillKeys: Array<keyof Skills> = [
  'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical',
]

/** Skills für Torhüter. */
export const gkSkillKeys: Array<keyof Skills> = [
  'gkReflexes', 'gkHandling', 'gkDiving', 'gkPositioning', 'gkKicking', 'pace',
]

function skillValue(player: Player, key: keyof Skills): number {
  const v = player.skills?.[key]
  return typeof v === 'number' ? v : DEFAULT_SKILL
}

/**
 * Score eines Spielers auf einer bestimmten Position (0 – 99).
 * Torhüter erhalten auf Feldpositionen 0 und umgekehrt.
 */
export function playerPositionScore(player: Player, position: Position): number {
  if (position === 'GK') {
    if (player.role !== 'GK') return 0
    const w = gkWeights
    const s =
      w.gkReflexes    * skillValue(player, 'gkReflexes')    +
      w.gkHandling    * skillValue(player, 'gkHandling')    +
      w.gkDiving      * skillValue(player, 'gkDiving')      +
      w.gkPositioning * skillValue(player, 'gkPositioning') +
      w.gkKicking     * skillValue(player, 'gkKicking')     +
      w.pace          * skillValue(player, 'pace')
    return s / 100
  }
  if (player.role === 'GK') return 0
  const w = fieldWeights[position]
  const s =
    w.pace      * skillValue(player, 'pace')      +
    w.shooting  * skillValue(player, 'shooting')  +
    w.passing   * skillValue(player, 'passing')   +
    w.dribbling * skillValue(player, 'dribbling') +
    w.defending * skillValue(player, 'defending') +
    w.physical  * skillValue(player, 'physical')
  const base = s / 100
  const bonus = player.preferredPositions?.includes(position) ? PREFERRED_POSITION_BONUS : 0
  return base + bonus
}

/** Anteil (0–1) der für eine Position relevanten Skills, die beim Spieler eingetragen sind. */
export function completeness(player: Player, position: Position): number {
  const keys =
    position === 'GK' && player.role === 'GK' ? gkSkillKeys :
    position !== 'GK' && player.role === 'FIELD' ? fieldSkillKeys :
    []
  if (keys.length === 0) return 0
  const filled = keys.filter((k) => typeof player.skills?.[k] === 'number').length
  return filled / keys.length
}

/** Ermittelt die für den Spieler beste Feldposition (für Coaching-Hinweise). */
export function bestFieldPosition(player: Player): { position: Position; score: number } | null {
  if (player.role !== 'FIELD') return null
  const positions: Position[] = Object.keys(fieldWeights) as Position[]
  let best: { position: Position; score: number } | null = null
  for (const pos of positions) {
    const s = playerPositionScore(player, pos)
    if (!best || s > best.score) best = { position: pos, score: s }
  }
  return best
}
