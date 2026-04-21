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

/** Ein Eintrag entspricht einem Duell "unser System gegen Gegner-System". */
export type TacticBookEntry = {
  id: string
  ourSystem: SystemId
  opponentSystem: SystemId
  rating: DuelRating
  character: string
  ourAdvantages: string[]
  ourDangers: string[]
  importantZones: string[]
  pressing: string[]
  inPossession: string[]
  transition: string[]
  liveCoaching: string[]
  adjustments: string[]
  // Phase 2 – erst in einer späteren Version befüllt:
  trainingForms?: string[]
  typicalProblems?: { problem: string; solution: string }[]
}

export type SectionKey =
  | 'character'
  | 'ourAdvantages'
  | 'ourDangers'
  | 'importantZones'
  | 'pressing'
  | 'inPossession'
  | 'transition'
  | 'liveCoaching'
  | 'adjustments'
  | 'trainingForms'
  | 'typicalProblems'

export type TacticBookView = 'matchday' | 'coach' | 'training'
export type PhaseTab = 'Aufbau' | 'Pressing' | 'Ballbesitz' | 'Umschalten' | 'Verteidigen'
