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

/** 11 fiktive Spieler – Namen klar erfunden, damit nichts mit echten Kadern kollidiert. */
const demoPlayers: Player[] = [
  { id: 'demo-gk', name: 'Tobias Wendt', role: 'GK', number: 1 },
  { id: 'demo-lb', name: 'Lukas Brandt', role: 'FIELD', number: 4 },
  { id: 'demo-cb1', name: 'Sven Adler', role: 'FIELD', number: 5 },
  { id: 'demo-cb2', name: 'Florian Reich', role: 'FIELD', number: 3 },
  { id: 'demo-rb', name: 'Max Hofer', role: 'FIELD', number: 2 },
  { id: 'demo-cdm', name: 'Jan Köhler', role: 'FIELD', number: 6 },
  { id: 'demo-cm1', name: 'Niklas Frei', role: 'FIELD', number: 8 },
  { id: 'demo-cm2', name: 'David Sommer', role: 'FIELD', number: 10 },
  { id: 'demo-lw', name: 'Elias Vogt', role: 'FIELD', number: 11 },
  { id: 'demo-st', name: 'Marco Sturm', role: 'FIELD', number: 9 },
  { id: 'demo-rw', name: 'Paul Lang', role: 'FIELD', number: 7 },
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
