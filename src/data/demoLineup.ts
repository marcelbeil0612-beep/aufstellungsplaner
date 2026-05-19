import type { SystemId } from './tacticBook'
import { defaultPhaseShape, type PhaseShape } from '../lib/phaseShift'
import type { Player } from '../types'
import { formationById } from './formations'

/**
 * Feste, deterministische Demo-Aufstellung mit rein fiktiven Spielernamen.
 * Zweck: ein reibungsfreies Werbe-Asset – ein Forenpost kann den Demo-Link
 * verlinken, der Empfänger sieht sofort eine fertige Aufstellung, ohne
 * Installation, Anmeldung oder Import. Bewusst NICHT aus dem echten Kader,
 * damit keine realen Namen nach außen geraten.
 */

/** URL-Fragment, das die Read-only-Demo öffnet: `…/#demo`. */
export const DEMO_HASH = '#demo'

/** True, wenn der übergebene Location-Hash die Demo anfordert. */
export const isDemoHash = (hash: string): boolean => {
  const clean = hash.startsWith('#') ? hash : '#' + hash
  return clean === DEMO_HASH
}

/**
 * True, wenn die laufende Seite eine Demo-Session ist (`…/#demo`).
 * Wird sowohl von der Storage-Schicht (Isolation: keine echten Nutzer-
 * daten lesen/schreiben) als auch von der App (Seed + Tour) genutzt.
 * Muss synchron zum Modul-/Store-Init auswertbar sein – daher reiner
 * `location.hash`-Check, kein React-State.
 */
export const isDemoSession = (): boolean =>
  typeof window !== 'undefined' && isDemoHash(window.location.hash)

export const DEMO_TITLE = 'Demo-Aufstellung · 4-3-3'

const DEMO_FORMATION_ID = '4-3-3'

/**
 * 11 fiktive Spieler – Namen klar erfunden, damit nichts mit echten
 * Kadern kollidiert. Mit plausiblen Skill-Werten + Stammpositionen,
 * damit der Kader-Skill-Screen, „Beste Aufstellung" und die Tour den
 * echten Wert zeigen (nicht leere Felder).
 */
const demoPlayers: Player[] = [
  {
    id: 'demo-gk', name: 'Tobias Wendt', role: 'GK', number: 1,
    skills: { gkReflexes: 84, gkHandling: 79, gkDiving: 82, gkPositioning: 80, gkKicking: 74, pace: 62 },
  },
  {
    id: 'demo-lb', name: 'Lukas Brandt', role: 'FIELD', number: 4,
    preferredPositions: ['LB'],
    skills: { pace: 82, shooting: 55, passing: 72, dribbling: 70, defending: 76, physical: 71 },
  },
  {
    id: 'demo-cb1', name: 'Sven Adler', role: 'FIELD', number: 5,
    preferredPositions: ['CB'],
    skills: { pace: 66, shooting: 48, passing: 68, dribbling: 55, defending: 86, physical: 84 },
  },
  {
    id: 'demo-cb2', name: 'Florian Reich', role: 'FIELD', number: 3,
    preferredPositions: ['CB'],
    skills: { pace: 69, shooting: 45, passing: 70, dribbling: 57, defending: 84, physical: 82 },
  },
  {
    id: 'demo-rb', name: 'Max Hofer', role: 'FIELD', number: 2,
    preferredPositions: ['RB'],
    skills: { pace: 83, shooting: 56, passing: 71, dribbling: 69, defending: 75, physical: 70 },
  },
  {
    id: 'demo-cdm', name: 'Jan Köhler', role: 'FIELD', number: 6,
    preferredPositions: ['CDM', 'CM'],
    skills: { pace: 68, shooting: 62, passing: 81, dribbling: 70, defending: 82, physical: 80 },
  },
  {
    id: 'demo-cm1', name: 'Niklas Frei', role: 'FIELD', number: 8,
    preferredPositions: ['CM'],
    skills: { pace: 74, shooting: 70, passing: 84, dribbling: 79, defending: 68, physical: 73 },
  },
  {
    id: 'demo-cm2', name: 'David Sommer', role: 'FIELD', number: 10,
    preferredPositions: ['CAM', 'CM'],
    skills: { pace: 77, shooting: 80, passing: 86, dribbling: 85, defending: 52, physical: 66 },
  },
  {
    id: 'demo-lw', name: 'Elias Vogt', role: 'FIELD', number: 11,
    preferredPositions: ['LW'],
    skills: { pace: 89, shooting: 75, passing: 74, dribbling: 86, defending: 45, physical: 64 },
  },
  {
    id: 'demo-st', name: 'Marco Sturm', role: 'FIELD', number: 9,
    preferredPositions: ['ST'],
    skills: { pace: 85, shooting: 88, passing: 68, dribbling: 78, defending: 42, physical: 80 },
  },
  {
    id: 'demo-rw', name: 'Paul Lang', role: 'FIELD', number: 7,
    preferredPositions: ['RW'],
    skills: { pace: 88, shooting: 76, passing: 75, dribbling: 85, defending: 46, physical: 63 },
  },
]

/** Slot-ID → Spieler-ID (Slots stammen aus formations.ts, 4-3-3). */
const demoAssignments: Record<string, string> = {
  gk: 'demo-gk',
  lb: 'demo-lb',
  cb1: 'demo-cb1',
  cb2: 'demo-cb2',
  rb: 'demo-rb',
  cdm: 'demo-cdm',
  cm1: 'demo-cm1',
  cm2: 'demo-cm2',
  lw: 'demo-lw',
  st: 'demo-st',
  rw: 'demo-rw',
}

/**
 * Vorausgewähltes Schaufenster-Duell für den Demo-Modus. Damit zeigt
 * das Systembuch beim Öffnen sofort ein ausgearbeitetes Duell (statt
 * des Vorworts) – genau dort sieht man den eigentlichen Wert.
 */
export const DEMO_DUEL: { our: SystemId; opp: SystemId } = {
  our: '4-3-3' as SystemId,
  opp: '4-4-2' as SystemId,
}

export const demoLineup = {
  formationId: DEMO_FORMATION_ID,
  title: DEMO_TITLE,
  players: demoPlayers,
  assignments: demoAssignments,
} as const

/**
 * Seed-Zustand für den interaktiven Demo-Modus: vollständige Slot-Map
 * (auch leere Slots als `null`), Demo-Kader, 4-3-3, Pro AN (damit der
 * Besucher alle Funktionen anklicken kann). Wird NICHT persistiert –
 * die Storage-Schicht ist im Demo-Modus eine No-op (siehe idbStorage).
 */
export function demoStoreSeed(): {
  formationId: string
  players: Player[]
  assignments: Record<string, string | null>
  isPro: true
  playerListIsUserManaged: true
  lastViewedDuel: { our: SystemId; opp: SystemId }
} {
  const formation = formationById(DEMO_FORMATION_ID)
  const assignments: Record<string, string | null> = {}
  for (const slot of formation.slots) {
    assignments[slot.id] = demoAssignments[slot.id] ?? null
  }
  return {
    formationId: DEMO_FORMATION_ID,
    players: demoPlayers,
    assignments,
    isPro: true,
    playerListIsUserManaged: true,
    lastViewedDuel: DEMO_DUEL,
  }
}

/**
 * Liefert die Demo als fertiges Render-Input für `renderLineupPng`.
 * Reine Datenfunktion (kein DOM/Canvas) – das eigentliche Rendern macht
 * der Aufrufer.
 */
export function demoExportInput(): {
  formation: ReturnType<typeof formationById>
  shape: PhaseShape
  phase: 'withBall'
  assignments: Record<string, string>
  players: Player[]
  title: string
} {
  return {
    formation: formationById(DEMO_FORMATION_ID),
    shape: { ...defaultPhaseShape.withBall },
    phase: 'withBall',
    assignments: demoAssignments,
    players: demoPlayers,
    title: DEMO_TITLE,
  }
}
