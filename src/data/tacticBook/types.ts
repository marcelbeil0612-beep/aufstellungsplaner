/** Systemkürzel – decken sich absichtlich mit den Formations-IDs in formations.ts,
 *  damit die App das aktuell ausgewählte System automatisch übernehmen kann. */
export type SystemId =
  | '4-3-3'
  | '4-2-3-1'
  | '4-4-2'
  | '4-4-2-raute'
  | '3-5-2'
  | '3-4-3'
  | '5-3-2'
  | '5-4-1'
  | '4-1-4-1'

export type DuelRating = 'vorteilhaft' | 'ausgeglichen' | 'unangenehm'

/**
 * Vier-Phasen-Modell des Fußballspiels (klassische Trainerausbildungs-Logik):
 *  - ownPossession: Wir BB, Gegner geordnet defensiv
 *  - afterLoss: Umschalten nach Ballverlust (beide ungeordnet)
 *  - oppPossession: Gegner BB, wir geordnet defensiv
 *  - afterGain: Umschalten nach Ballgewinn (beide ungeordnet)
 *
 * Kreislauf: ownPossession → afterLoss → oppPossession → afterGain → ownPossession
 */
export type PhaseKey = 'ownPossession' | 'afterLoss' | 'oppPossession' | 'afterGain'

/**
 * Analyse einer Spielphase in einer konkreten System-vs-System-Konstellation.
 * Vier inhaltliche Säulen statt einer Sammelliste — räumliches Denken
 * (wo entsteht Platz, wo wird's eng), phasen-spezifische Vor-/Nachteile,
 * konkrete umsetzbare Spielerverhalten.
 */
export type PhaseAnalysis = {
  /** Räume und Engpässe: wo entsteht Platz, wo wird es eng. 2–5 Items. */
  spaces: string[]
  /** Konkrete Vorteile, die wir IN DIESER PHASE haben. 2–4 Items. */
  advantages: string[]
  /** Konkrete Gefahren, die uns IN DIESER PHASE drohen. 2–4 Items. */
  dangers: string[]
  /** Konkrete Spieler-Aktionen: Zuordnungen, Laufwege, Anspielwinkel. 3–5 Items. */
  keyActions: string[]
}

/** Ein Eintrag entspricht einem Duell "unser System gegen Gegner-System". */
export type TacticBookEntry = {
  id: string
  ourSystem: SystemId
  opponentSystem: SystemId
  rating: DuelRating
  character: string

  /**
   * Vier-Phasen-Analyse — die neue Hauptstruktur. Optional während der Migration
   * (81 Einträge werden schrittweise ins neue Schema überführt). Sobald gesetzt,
   * rendert die UI die Phase-Karten und ignoriert die alten Felder unten.
   */
  phases?: Record<PhaseKey, PhaseAnalysis>

  /** 1–3 wichtigste Coaching-Zurufe für DIESES Match. */
  liveCoaching: string[]
  /** Ingame-Anpassungen, wenn das Duell kippt. */
  adjustments: string[]

  // ─── Legacy-Felder (Stand vor 4-Phasen-Migration) ──────────────────────
  // Bleiben befüllt, bis das jeweilige Duell ins neue Schema migriert ist.
  // Sobald alle 81 Einträge `phases` haben, werden diese Felder entfernt.
  /** @deprecated Wandert in den jeweiligen `phases.*.advantages` */
  ourAdvantages: string[]
  /** @deprecated Wandert in den jeweiligen `phases.*.dangers` */
  ourDangers: string[]
  /** @deprecated Wandert in den jeweiligen `phases.*.spaces` */
  importantZones: string[]
  /** @deprecated Wandert in `phases.oppPossession.keyActions` */
  pressing: string[]
  /** @deprecated Wandert in `phases.ownPossession.keyActions` */
  inPossession: string[]
  /** @deprecated Wird gesplittet in `phases.afterLoss` und `phases.afterGain` */
  transition: string[]
  /** @deprecated Komplett entfernt — kein Trainings-Modul mehr im Scope */
  trainingForms?: string[]
  /** @deprecated Komplett entfernt */
  typicalProblems?: { problem: string; solution: string }[]
}

/** Anzeigename + Kürzel für die 4 Phasen, zentral gepflegt. */
export const phaseMeta: Record<PhaseKey, { label: string; short: string; tooltip: string; icon: string }> = {
  ownPossession: {
    label: 'Eigener Ballbesitz',
    short: 'BB+',
    tooltip: 'Wir Ballbesitz, Gegner geordnet defensiv',
    icon: '⚽',
  },
  afterLoss: {
    label: 'Nach Ballverlust',
    short: 'Verlust',
    tooltip: 'Umschalten defensiv — beide noch ungeordnet',
    icon: '🔄',
  },
  oppPossession: {
    label: 'Gegen den Ball',
    short: 'BB-',
    tooltip: 'Gegner Ballbesitz, wir geordnet defensiv',
    icon: '🛡',
  },
  afterGain: {
    label: 'Nach Ballgewinn',
    short: 'Gewinn',
    tooltip: 'Umschalten offensiv — Gegner noch ungeordnet',
    icon: '⚡',
  },
}

/** Reihenfolge der 4 Phasen für UI-Rendering (klassischer Kreislauf). */
export const phaseOrder: PhaseKey[] = ['ownPossession', 'afterLoss', 'oppPossession', 'afterGain']

