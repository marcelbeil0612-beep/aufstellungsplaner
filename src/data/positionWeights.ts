import type { Position } from '../types'

/**
 * Skill-Gewichtung je Position. Summe pro Position = 100 %.
 * Angelehnt an FIFA-/Wyscout-Positionsprofile als Konsens-Mittel.
 * Wird in Phase 2 (Skill-Score / Auto-Aufstellung) genutzt.
 */
export const fieldWeights: Record<
  Exclude<Position, 'GK'>,
  { pace: number; shooting: number; passing: number; dribbling: number; defending: number; physical: number }
> = {
  CB:  { pace: 10, shooting: 5,  passing: 15, dribbling: 5,  defending: 35, physical: 30 },
  LB:  { pace: 25, shooting: 5,  passing: 15, dribbling: 10, defending: 25, physical: 20 },
  RB:  { pace: 25, shooting: 5,  passing: 15, dribbling: 10, defending: 25, physical: 20 },
  LWB: { pace: 25, shooting: 10, passing: 15, dribbling: 15, defending: 20, physical: 15 },
  RWB: { pace: 25, shooting: 10, passing: 15, dribbling: 15, defending: 20, physical: 15 },
  CDM: { pace: 5,  shooting: 10, passing: 25, dribbling: 10, defending: 30, physical: 20 },
  CM:  { pace: 10, shooting: 15, passing: 25, dribbling: 15, defending: 15, physical: 20 },
  CAM: { pace: 15, shooting: 20, passing: 25, dribbling: 25, defending: 5,  physical: 10 },
  LM:  { pace: 20, shooting: 15, passing: 20, dribbling: 20, defending: 15, physical: 10 },
  RM:  { pace: 20, shooting: 15, passing: 20, dribbling: 20, defending: 15, physical: 10 },
  LW:  { pace: 30, shooting: 15, passing: 15, dribbling: 25, defending: 5,  physical: 10 },
  RW:  { pace: 30, shooting: 15, passing: 15, dribbling: 25, defending: 5,  physical: 10 },
  ST:  { pace: 20, shooting: 35, passing: 5,  dribbling: 15, defending: 5,  physical: 20 },
  CF:  { pace: 15, shooting: 30, passing: 15, dribbling: 20, defending: 5,  physical: 15 },
}

export const gkWeights = {
  gkReflexes: 25,
  gkHandling: 20,
  gkDiving: 20,
  gkPositioning: 15,
  gkKicking: 10,
  pace: 10,
} as const

/** Deutscher Anzeigename je Position. */
export const positionLabel: Record<Position, string> = {
  GK:  'Torwart',
  CB:  'Innenverteidiger',
  LB:  'Linker Verteidiger',
  RB:  'Rechter Verteidiger',
  LWB: 'Linker Schienenspieler',
  RWB: 'Rechter Schienenspieler',
  CDM: 'Defensives Mittelfeld',
  CM:  'Zentrales Mittelfeld',
  CAM: 'Offensives Mittelfeld',
  LM:  'Linkes Mittelfeld',
  RM:  'Rechtes Mittelfeld',
  LW:  'Linker Flügel',
  RW:  'Rechter Flügel',
  ST:  'Stürmer',
  CF:  'Hängende Spitze',
}

/** Kurzkürzel für die Slot-Marker auf dem Feld. */
export const positionShort: Record<Position, string> = {
  GK:  'TW',
  CB:  'IV',
  LB:  'LV',
  RB:  'RV',
  LWB: 'LWB',
  RWB: 'RWB',
  CDM: 'DM',
  CM:  'ZM',
  CAM: 'OM',
  LM:  'LM',
  RM:  'RM',
  LW:  'LF',
  RW:  'RF',
  ST:  'ST',
  CF:  'HS',
}
