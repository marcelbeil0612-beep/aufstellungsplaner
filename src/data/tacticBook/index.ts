import { entriesOur343 } from './entries/our-3-4-3'
import { entriesOur4231 } from './entries/our-4-2-3-1'
import { entriesOur433 } from './entries/our-4-3-3'
import { entriesOur442 } from './entries/our-4-4-2'
import { entriesOur442Raute } from './entries/our-4-4-2-raute'
import { entriesOur532 } from './entries/our-5-3-2'
import { entriesOur541 } from './entries/our-5-4-1'
import { entriesOur352 } from './entries/our-3-5-2'
import type { SystemId, TacticBookEntry } from './types'

export * from './systems'
export * from './types'

export const tacticBook: TacticBookEntry[] = [
  ...entriesOur433,
  ...entriesOur4231,
  ...entriesOur352,
  ...entriesOur343,
  ...entriesOur442,
  ...entriesOur442Raute,
  ...entriesOur532,
  ...entriesOur541,
]

/** Findet einen Eintrag per Systemen – null, wenn noch nicht erfasst. */
export function findEntry(ourSystem: SystemId, opponentSystem: SystemId): TacticBookEntry | null {
  return tacticBook.find(
    (e) => e.ourSystem === ourSystem && e.opponentSystem === opponentSystem,
  ) ?? null
}

/** Alle Duelle für ein eigenes System – in der natürlichen Systems-Reihenfolge. */
export function entriesForOurSystem(ourSystem: SystemId): TacticBookEntry[] {
  return tacticBook.filter((e) => e.ourSystem === ourSystem)
}
