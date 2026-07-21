import type { Player, Substitution } from '../types'

/**
 * Kompakte Share-Repräsentation einer Aufstellung. Spieler werden über NAMEN
 * referenziert, weil die IDs zwischen Trainer-Geräten unterschiedlich sind:
 * ein Empfänger matcht namentlich gegen seinen eigenen Kader.
 */
export type SharePayload = {
  /** Schemaversion. */
  v: 1
  /** formationId aus formations.ts. */
  f: string
  /** [slotId, playerName] – ein Eintrag pro besetztem Slot. */
  a: Array<[string, string]>
  /** Auswechselplan, namebasiert (out / in / Minute / Notiz). */
  s?: Array<{ m?: number; o: string; i: string; n?: string }>
  /**
   * Ersatzbank, positionstreu und namebasiert (null = freier Platz).
   * Optional und additiv: ältere Clients ignorieren das Feld, neuere lesen bei
   * älteren Links schlicht keine Bank – deshalb bleibt `v` bei 1.
   */
  b?: Array<string | null>
  /** Anzeigetitel (z. B. Datum / Gegner). */
  t?: string
}

/** Prefix im URL-Fragment: `#share=…`. */
const HASH_PREFIX = '#share='

function toBase64Url(input: string): string {
  // Unicode-sichere Variante: TextEncoder → btoa, dann URL-Safe-Charset.
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

type ShareInput = {
  formationId: string
  assignments: Record<string, string | null>
  substitutions: Substitution[]
  /** Ersatzbank als Spieler-IDs (null = freier Platz). */
  bench?: Array<string | null>
  players: Player[]
  title?: string
}

/** Baut den `#share=…`-Hash für eine Aufstellung. Spieler werden namensbasiert serialisiert. */
export function buildShareHash(input: ShareInput): string {
  const playerById = new Map(input.players.map((p) => [p.id, p]))
  const nameOf = (id: string): string | undefined => playerById.get(id)?.name

  const assignments: SharePayload['a'] = []
  for (const [slotId, playerId] of Object.entries(input.assignments)) {
    if (!playerId) continue
    const name = nameOf(playerId)
    if (name) assignments.push([slotId, name])
  }

  const subs: SharePayload['s'] = []
  for (const sub of input.substitutions) {
    const o = nameOf(sub.outPlayerId)
    const i = nameOf(sub.inPlayerId)
    if (!o || !i) continue
    subs.push({
      ...(typeof sub.minute === 'number' ? { m: sub.minute } : {}),
      o,
      i,
      ...(sub.note ? { n: sub.note } : {}),
    })
  }

  // Bank positionstreu: unbekannte Spieler werden zu freien Plätzen, damit die
  // Sitzordnung des Absenders erhalten bleibt.
  const bench = (input.bench ?? []).map((id) => (id ? nameOf(id) ?? null : null))
  const hasBench = bench.some((name) => name !== null)

  const payload: SharePayload = {
    v: 1,
    f: input.formationId,
    a: assignments,
    ...(subs.length > 0 ? { s: subs } : {}),
    ...(hasBench ? { b: bench } : {}),
    ...(input.title ? { t: input.title } : {}),
  }
  return HASH_PREFIX + toBase64Url(JSON.stringify(payload))
}

/** Liest einen Share-Hash und gibt die Payload zurück (oder null bei ungültig). */
export function parseShareHash(hash: string): SharePayload | null {
  if (!hash) return null
  const clean = hash.startsWith('#') ? hash : '#' + hash
  if (!clean.startsWith(HASH_PREFIX)) return null
  const encoded = clean.slice(HASH_PREFIX.length)
  if (!encoded) return null
  try {
    const json = fromBase64Url(encoded)
    const parsed = JSON.parse(json) as unknown
    if (!isSharePayload(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function isSharePayload(x: unknown): x is SharePayload {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    o.v === 1 &&
    typeof o.f === 'string' &&
    Array.isArray(o.a) &&
    o.a.every(
      (pair) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        typeof pair[0] === 'string' &&
        typeof pair[1] === 'string',
    )
  )
}

/** Komplett-URL inkl. aktuellem `location.origin` + `pathname`. */
export function buildShareUrl(input: ShareInput): string {
  const base =
    typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
  return base + buildShareHash(input)
}

export type ShareMatchResult = {
  formationId: string
  /** [slotId, playerId] – nur Slots, deren Spieler lokal über den Namen gefunden wurden. */
  assignments: Array<[string, string]>
  /** Sub mit aufgelösten lokalen IDs. */
  substitutions: Array<{ minute?: number; outPlayerId: string; inPlayerId: string; note?: string }>
  /** Ersatzbank mit lokalen IDs, positionstreu (null = frei/nicht gefunden). */
  bench: Array<string | null>
  /** Namen aus dem Share, für die kein lokaler Spieler gefunden wurde. */
  missingPlayers: string[]
  title?: string
}

/** Matcht die Share-Payload gegen einen lokalen Kader (case-insensitive über den Namen). */
export function matchShareToRoster(
  payload: SharePayload,
  roster: Player[],
): ShareMatchResult {
  const byName = new Map<string, string>()
  for (const p of roster) byName.set(p.name.trim().toLowerCase(), p.id)
  const resolve = (name: string): string | undefined =>
    byName.get(name.trim().toLowerCase())

  const missing = new Set<string>()
  const assignments: ShareMatchResult['assignments'] = []
  for (const [slotId, name] of payload.a) {
    const id = resolve(name)
    if (id) assignments.push([slotId, id])
    else missing.add(name)
  }
  const subs: ShareMatchResult['substitutions'] = []
  for (const sub of payload.s ?? []) {
    const outId = resolve(sub.o)
    const inId = resolve(sub.i)
    if (!outId) missing.add(sub.o)
    if (!inId) missing.add(sub.i)
    if (outId && inId) {
      subs.push({
        minute: sub.m,
        outPlayerId: outId,
        inPlayerId: inId,
        note: sub.n,
      })
    }
  }

  const bench: ShareMatchResult['bench'] = (payload.b ?? []).map((name) => {
    if (typeof name !== 'string' || !name) return null
    const id = resolve(name)
    if (!id) {
      missing.add(name)
      return null
    }
    return id
  })

  return {
    formationId: payload.f,
    assignments,
    substitutions: subs,
    bench,
    missingPlayers: Array.from(missing).sort((a, b) => a.localeCompare(b, 'de')),
    title: payload.t,
  }
}
