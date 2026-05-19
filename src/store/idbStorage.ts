import { get as idbGet, set as idbSet, del as idbDel, createStore } from 'idb-keyval'
import { createJSONStorage, type StateStorage } from 'zustand/middleware'
import { isDemoSession } from '../data/demoLineup'

/**
 * Eigener IndexedDB-Objektspeicher, damit wir nicht mit Fremd-Libs kollidieren
 * und das Ganze unter „Settings → Safari → Website-Daten" klar zuzuordnen ist.
 */
const idbInstance = createStore('aufstellungsplaner-db', 'kv')

/**
 * Einmalige Migration: wenn im IndexedDB noch nichts liegt, der alte
 * localStorage-Eintrag aber existiert, kopieren wir ihn rüber. Das alte
 * LS-Entry lassen wir zunächst stehen (fail-safe für Rollbacks).
 */
let migrationPromise: Promise<void> | null = null
function migrateFromLocalStorageOnce(key: string): Promise<void> {
  if (migrationPromise) return migrationPromise
  migrationPromise = (async () => {
    try {
      const existing = await idbGet<string>(key, idbInstance)
      if (typeof existing === 'string') return
      if (typeof localStorage === 'undefined') return
      const fromLs = localStorage.getItem(key)
      if (!fromLs) return
      await idbSet(key, fromLs, idbInstance)
    } catch {
      /* Best-effort: bei Fehler gibt's halt keine Migration. */
    }
  })()
  return migrationPromise
}

/**
 * Zustand-konforme Storage-Schicht. Die Werte sind JSON-Strings (Zustand's
 * `createJSONStorage` macht das Parsing außenrum).
 */
const idbStateStorage: StateStorage = {
  getItem: async (name) => {
    await migrateFromLocalStorageOnce(name)
    const v = await idbGet<string>(name, idbInstance)
    return typeof v === 'string' ? v : null
  },
  setItem: async (name, value) => {
    await idbSet(name, value, idbInstance)
  },
  removeItem: async (name) => {
    await idbDel(name, idbInstance)
  },
}

/**
 * Flüchtige No-op-Storage für die Demo-Session (`…/#demo`). Liefert beim
 * Lesen immer `null` (Store startet auf Defaults, die App seedet die
 * Demo) und verwirft jedes Schreiben. So werden die echten IndexedDB-
 * Daten eines Besuchers im Demo-Modus WEDER gelesen NOCH überschrieben.
 */
const memoryStateStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

/**
 * Fertiger Storage, direkt an `persist({ storage: lineupStorage })`
 * übergebbar. Die Storage-Wahl fällt beim Hydrieren (Client) – im
 * Demo-Modus strikt isoliert, sonst echtes IndexedDB.
 */
export const lineupStorage = createJSONStorage(() =>
  isDemoSession() ? memoryStateStorage : idbStateStorage,
)
