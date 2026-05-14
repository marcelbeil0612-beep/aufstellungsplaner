import { createStore, del as idbDel, get as idbGet, set as idbSet } from 'idb-keyval'
import { create } from 'zustand'
import type { Player } from '../types'

/**
 * Eigener IDB-Objektspeicher nur für Foto-Blobs. Liegt absichtlich neben dem
 * Haupt-Store ("aufstellungsplaner-db"), damit das Schreiben großer Spielerstammdaten
 * nicht jedes Mal die kompletten Fotos durch die JSON-Serialisierung jagt.
 */
const photoIdb = createStore('aufstellungsplaner-photos', 'kv')

async function getBlob(id: string): Promise<Blob | undefined> {
  try {
    return await idbGet<Blob>(id, photoIdb)
  } catch {
    return undefined
  }
}

async function putBlob(id: string, blob: Blob): Promise<void> {
  await idbSet(id, blob, photoIdb)
}

async function deleteBlob(id: string): Promise<void> {
  await idbDel(id, photoIdb)
}

type PhotoState = {
  /** photoId → Object-URL. Wird beim Render der Spieler-Chips direkt gelesen. */
  urls: Record<string, string>
  /** Lädt einen Blob aus dem IDB, baut einen Object-URL und cached ihn. */
  load: (id: string) => Promise<void>
  /** Speichert einen Blob und legt sofort einen Object-URL im Cache an. */
  put: (id: string, blob: Blob) => Promise<void>
  /** Entfernt Blob und Object-URL. */
  remove: (id: string) => Promise<void>
  /** Lädt mehrere photoIds parallel. Skipped IDs, deren URL bereits gecached ist. */
  preload: (ids: string[]) => Promise<void>
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  urls: {},
  load: async (id) => {
    if (get().urls[id]) return
    const blob = await getBlob(id)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    set((s) => (s.urls[id] ? s : { urls: { ...s.urls, [id]: url } }))
  },
  put: async (id, blob) => {
    const old = get().urls[id]
    await putBlob(id, blob)
    const url = URL.createObjectURL(blob)
    set((s) => ({ urls: { ...s.urls, [id]: url } }))
    if (old) URL.revokeObjectURL(old)
  },
  remove: async (id) => {
    const old = get().urls[id]
    await deleteBlob(id)
    set((s) => {
      if (!(id in s.urls)) return s
      const next = { ...s.urls }
      delete next[id]
      return { urls: next }
    })
    if (old) URL.revokeObjectURL(old)
  },
  preload: async (ids) => {
    const { urls, load } = get()
    await Promise.all(ids.filter((id) => !urls[id]).map((id) => load(id)))
  },
}))

/** Selector-Helfer: gibt die Object-URL zu einer photoId zurück (oder undefined). */
export const selectPhotoUrl = (s: PhotoState, id: string | undefined): string | undefined =>
  id ? s.urls[id] : undefined

/**
 * Liefert die anzuzeigende Foto-URL für einen Spieler:
 * - bevorzugt die im IDB gespeicherte (Object-URL via photoId)
 * - fällt auf das Legacy-`photo` (Data-URL) zurück, solange die Migration
 *   nach Hydration noch nicht durchgelaufen ist
 * - liefert undefined, wenn kein Foto hinterlegt ist (Chip rendert Initialen)
 */
export function usePlayerPhotoUrl(
  player: Pick<Player, 'photo' | 'photoId'>,
): string | undefined {
  const url = usePhotoStore((s) => (player.photoId ? s.urls[player.photoId] : undefined))
  return url ?? player.photo
}

/** Erzeugt eine neue, kollisionsarme photoId. */
export function newPhotoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'p-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
