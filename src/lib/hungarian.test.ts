import { describe, expect, it } from 'vitest'
import { hungarianMin } from './hungarian'

/**
 * Hilfsfunktion: Summiere die Kosten der gewählten Zuordnung.
 * Erlaubt es, optimale Lösungen mit anderen permutativen Lösungen zu vergleichen,
 * ohne sich auf konkrete Spaltenindizes festzulegen (es kann mehrere Optima geben).
 */
function totalCost(cost: number[][], pick: number[]): number {
  return pick.reduce((sum, col, row) => (col < 0 ? sum : sum + cost[row][col]), 0)
}

describe('hungarianMin', () => {
  it('löst das klassische 3×3-Beispiel optimal', () => {
    // Optimum ist 0→1=1, 1→0=2, 2→2=2 → Summe 5.
    const cost = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
    ]
    const pick = hungarianMin(cost)
    expect(totalCost(cost, pick)).toBe(5)
    // Jede Zeile bekommt eine Spalte und keine Spalte wird doppelt vergeben.
    expect(new Set(pick).size).toBe(pick.length)
  })

  it('funktioniert für rechteckige Matrizen (mehr Spalten als Zeilen)', () => {
    // 2 Slots, 4 Spieler: Optimum nutzt Spieler 1 in Slot 0 (Kosten 1) +
    // irgendein anderer Spieler in Slot 1 (alle Kosten 9) = 10.
    const cost = [
      [5, 1, 9, 9],
      [9, 9, 9, 9],
    ]
    const pick = hungarianMin(cost)
    expect(pick.length).toBe(2)
    expect(totalCost(cost, pick)).toBe(10)
    // Die billigste Spalte für Zeile 0 muss tatsächlich gewählt sein.
    expect(pick[0]).toBe(1)
  })

  it('liefert leeres Array für leere Eingabe', () => {
    expect(hungarianMin([])).toEqual([])
  })

  it('wirft, wenn weniger Spalten als Zeilen vorhanden sind', () => {
    expect(() => hungarianMin([[1, 2], [3, 4], [5, 6]])).toThrow()
  })

  it('vermeidet greedy Fehler – wählt das globale Optimum', () => {
    // Wenn man greedy pro Zeile minimiert, würde man Zeile 0 → Spalte 0 (1) nehmen,
    // dann Zeile 1 → Spalte 1 (100). Globales Optimum: Zeile 0 → Spalte 1 (2),
    // Zeile 1 → Spalte 0 (3) → Summe 5 statt 101.
    const cost = [
      [1, 2],
      [3, 100],
    ]
    const pick = hungarianMin(cost)
    expect(totalCost(cost, pick)).toBe(5)
  })

  it('ist deterministisch (gleiche Eingabe → gleiche Ausgabe)', () => {
    const cost = [
      [4, 1, 3],
      [2, 0, 5],
      [3, 2, 2],
    ]
    expect(hungarianMin(cost)).toEqual(hungarianMin(cost))
  })
})
