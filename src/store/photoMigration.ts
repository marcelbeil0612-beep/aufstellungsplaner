import { dataUrlToBlob } from '../lib/photoUtils'
import { newPhotoId, usePhotoStore } from './photoStore'
import { useLineupStore } from './useLineupStore'

/**
 * Wandert ein einzelnes Legacy-Foto (Data-URL aus ≤ v5 Persistenz) in den
 * Photo-IDB-Store um und aktualisiert den Spieler-State, damit es ab jetzt
 * per `photoId` referenziert wird.
 */
async function migrateLegacyPhoto(playerId: string, dataUrl: string): Promise<void> {
  try {
    const blob = await dataUrlToBlob(dataUrl)
    const id = newPhotoId()
    await usePhotoStore.getState().put(id, blob)
    useLineupStore.setState((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, photoId: id, photo: undefined } : p,
      ),
    }))
  } catch (e) {
    console.warn('[photoMigration] Konnte Legacy-Foto nicht migrieren', playerId, e)
  }
}

/**
 * Nach Hydration:
 *  1. Legacy-Data-URLs (Feld `photo`) in den Photo-IDB-Store verschieben.
 *  2. Object-URLs für alle bereits migrierten `photoId`s in den Cache laden,
 *     damit die Chips synchron rendern können.
 */
function bootstrap(): void {
  const state = useLineupStore.getState()

  const legacy = state.players.filter((p) => p.photo && !p.photoId)
  for (const p of legacy) {
    if (p.photo) void migrateLegacyPhoto(p.id, p.photo)
  }

  const ids = state.players
    .map((p) => p.photoId)
    .filter((x): x is string => typeof x === 'string')
  void usePhotoStore.getState().preload(ids)
}

/**
 * Setzt das Photo-Subsystem in Gang: Legacy-Migration + Preload der
 * Object-URLs. Aus `main.tsx` einmalig nach dem Mount aufrufen.
 */
export function initPhotoSystem(): void {
  if (useLineupStore.persist.hasHydrated()) {
    bootstrap()
  } else {
    useLineupStore.persist.onFinishHydration(bootstrap)
  }
}
