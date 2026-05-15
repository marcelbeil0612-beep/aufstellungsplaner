import { describe, expect, it } from 'vitest'
import type { Player } from '../types'
import {
  bestFieldPosition,
  completeness,
  DEFAULT_SKILL,
  PREFERRED_POSITION_BONUS,
  playerPositionScore,
} from './score'

const field = (skills: Player['skills'] = {}): Player => ({
  id: 'p',
  name: 'Player',
  role: 'FIELD',
  skills,
})

const gk = (skills: Player['skills'] = {}): Player => ({
  id: 'g',
  name: 'Keeper',
  role: 'GK',
  skills,
})

describe('playerPositionScore', () => {
  it('gibt 0 für Torhüter auf Feldpositionen und umgekehrt', () => {
    expect(playerPositionScore(gk(), 'ST')).toBe(0)
    expect(playerPositionScore(field(), 'GK')).toBe(0)
  })

  it('liefert ohne Skills den Neutralwert (50)', () => {
    expect(playerPositionScore(field(), 'CB')).toBeCloseTo(DEFAULT_SKILL, 5)
    expect(playerPositionScore(gk(), 'GK')).toBeCloseTo(DEFAULT_SKILL, 5)
  })

  it('belohnt Stärken passend zur Positionsgewichtung', () => {
    const fast = field({ pace: 99 })
    // LW gewichtet pace mit 30%: 30 * 99 / 100 + 70 * 50 / 100 = 29.7 + 35 = 64.7
    expect(playerPositionScore(fast, 'LW')).toBeGreaterThan(playerPositionScore(field(), 'LW'))
  })

  it('bestraft Schwächen analog', () => {
    const slow = field({ pace: 1 })
    expect(playerPositionScore(slow, 'LW')).toBeLessThan(playerPositionScore(field(), 'LW'))
  })

  it('addiert den Stammpositions-Bonus genau einmal auf der präferierten Position', () => {
    const player: Player = { ...field(), preferredPositions: ['CB', 'CM'] }
    const baseline = playerPositionScore(field(), 'CB')
    expect(playerPositionScore(player, 'CB')).toBeCloseTo(baseline + PREFERRED_POSITION_BONUS, 5)
    // Außerhalb der Stammposition: kein Bonus.
    expect(playerPositionScore(player, 'LW')).toBeCloseTo(
      playerPositionScore(field(), 'LW'),
      5,
    )
  })

  it('gewährt Torhütern keinen Bonus auf Feldpositionen (Rolle dominiert)', () => {
    const keeper: Player = { ...gk(), preferredPositions: ['ST'] }
    expect(playerPositionScore(keeper, 'ST')).toBe(0)
  })
})

describe('completeness', () => {
  it('ist 1, wenn alle relevanten Skills gesetzt sind', () => {
    const full = field({
      pace: 70,
      shooting: 70,
      passing: 70,
      dribbling: 70,
      defending: 70,
      physical: 70,
    })
    expect(completeness(full, 'CM')).toBe(1)
  })

  it('ist 0, wenn der Spieler die falsche Rolle für die Position hat', () => {
    expect(completeness(gk(), 'ST')).toBe(0)
    expect(completeness(field(), 'GK')).toBe(0)
  })

  it('gibt anteilig den Wert zurück', () => {
    const partial = field({ pace: 70, shooting: 70, passing: 70 })
    // 3 von 6 Feld-Skills gesetzt = 0.5
    expect(completeness(partial, 'CM')).toBe(0.5)
  })
})

describe('bestFieldPosition', () => {
  it('gibt null für Torhüter', () => {
    expect(bestFieldPosition(gk())).toBeNull()
  })

  it('findet eine Position mit positivem Score für Feldspieler', () => {
    const player = field({ shooting: 99, pace: 90, dribbling: 80 })
    const best = bestFieldPosition(player)
    expect(best).not.toBeNull()
    expect(best!.score).toBeGreaterThan(DEFAULT_SKILL)
  })
})
