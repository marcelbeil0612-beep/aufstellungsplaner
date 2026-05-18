import type { Phase } from './phaseShift'
import { migratePersistedState, STORE_VERSION, useLineupStore } from '../store/useLineupStore'

const BACKUP_VERSION = 1
const MAGIC = 'aufstellungsplaner-backup'

type BackupPayload = {
  type: typeof MAGIC
  backupVersion: number
  storeVersion: number
  exportedAt: string
  state: {
    formationId: string
    assignments: Record<string, string | null>
    savedLineups: unknown[]
    activeLineupId: string | null
    players: unknown[]
    phase: Phase
    phaseShape?: unknown
    license?: unknown
    lastViewedDuel?: unknown
    playerListIsUserManaged?: boolean
    substitutions?: unknown[]
    matches?: unknown[]
  }
}

/** Serialisiert den kompletten persistierten Store als JSON-Blob. */
export function exportBackupBlob(): Blob {
  const s = useLineupStore.getState()
  const payload: BackupPayload = {
    type: MAGIC,
    backupVersion: BACKUP_VERSION,
    storeVersion: STORE_VERSION,
    exportedAt: new Date().toISOString(),
    state: {
      formationId: s.formationId,
      assignments: s.assignments,
      savedLineups: s.savedLineups,
      activeLineupId: s.activeLineupId,
      players: s.players,
      phase: s.phase,
      phaseShape: s.phaseShape,
      license: s.license,
      lastViewedDuel: s.lastViewedDuel,
      playerListIsUserManaged: s.playerListIsUserManaged,
      substitutions: s.substitutions,
      matches: s.matches,
    },
  }
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
}

/** Vorschlag für einen Dateinamen inkl. Datum. */
export function suggestedBackupFilename(): string {
  const d = new Date()
  const stamp = d.toISOString().slice(0, 10)
  return `aufstellungsplaner-backup-${stamp}.json`
}

function isBackupPayload(x: unknown): x is BackupPayload {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return o.type === MAGIC && typeof o.state === 'object' && o.state !== null
}

/** Liest eine .json-Backup-Datei und stellt den Store daraus wieder her. */
export async function importBackupFile(file: File): Promise<BackupPayload> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Datei konnte nicht als JSON gelesen werden.')
  }
  if (!isBackupPayload(parsed)) {
    throw new Error('Datei ist kein Aufstellungsplaner-Backup.')
  }
  // Backups älterer App-Versionen durch dieselbe Migrationskette schicken wie
  // beim normalen Persist-Boot, damit fehlende Felder (z. B. lastViewedDuel)
  // mit Default-Werten aufgefüllt werden, statt im Store als `undefined` zu landen.
  const fromVersion = typeof parsed.storeVersion === 'number' ? parsed.storeVersion : 1
  const migrated = migratePersistedState(parsed.state, fromVersion)
  useLineupStore.getState().restoreFromBackup(migrated)
  return parsed
}

/** Startet den Browser-Download des Backups. */
export function downloadBackup(): void {
  const blob = exportBackupBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = suggestedBackupFilename()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Kurze Verzögerung, damit der Download-Handler greifen kann, bevor die URL widerrufen wird
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
