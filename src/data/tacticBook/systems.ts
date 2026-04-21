import type { SystemId } from './types'

/** Darstellungstexte für Dropdown- und Listeneinträge. */
export const systemLabels: Record<SystemId, string> = {
  '4-3-3': '4-3-3',
  '4-2-3-1': '4-2-3-1',
  '4-4-2': '4-4-2',
  '4-4-2-raute': '4-4-2 (Raute)',
  '3-5-2': '3-5-2',
  '3-4-3': '3-4-3',
  '5-3-2': '5-3-2',
  '5-4-1': '5-4-1',
  '4-1-4-1': '4-1-4-1',
}

export const systemOrder: SystemId[] = [
  '4-3-3', '4-2-3-1', '4-4-2', '4-4-2-raute',
  '3-5-2', '3-4-3', '5-3-2', '5-4-1', '4-1-4-1',
]

/**
 * Bildet die Formations-ID aus dem Aufstellungsplaner auf eine SystemId ab.
 * "4-3-3 False 9" teilt sich den Eintrag mit "4-3-3"; andere Formationen
 * haben dieselbe ID und werden direkt zurückgegeben.
 */
export function formationIdToSystemId(formationId: string): SystemId {
  if (formationId === '4-3-3-false9') return '4-3-3'
  if ((systemOrder as string[]).includes(formationId)) return formationId as SystemId
  return '4-3-3'
}
