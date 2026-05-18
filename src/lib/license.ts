import { LICENSE_PUBLIC_KEY_B64, type PlanId } from './billing'

/**
 * Lizenz-Token (asymmetrisch signiert, offline verifizierbar):
 *   base64url(JSON-Claims) + "." + base64url(ECDSA-P-256-Signatur, raw)
 * Der Server signiert mit dem Private Key; die App verifiziert hier nur
 * mit dem öffentlichen Schlüssel (kein Secret im Client).
 */
export type LicenseClaims = {
  v: 1
  email: string
  plan: PlanId
  /** Ablauf (Unix-Sekunden). Lifetime = sehr fern in der Zukunft. */
  exp: number
  /** Ausgestellt (Unix-Sekunden). */
  iat: number
  /** Paddle-Subscription-ID (nur bei Abos), für späteres Refresh. */
  sub?: string
}

/** Offline-Karenz: abgelaufene Abos bleiben so lange nutzbar (Tage). */
export const LICENSE_GRACE_DAYS = 90

function b64urlToBytes(s: string): Uint8Array {
  // Akzeptiert base64 UND base64url, mit oder ohne Padding.
  const t = s.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '')
  const pad = t.length % 4 === 0 ? '' : '='.repeat(4 - (t.length % 4))
  const bin = atob(t + pad)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

let cachedKey: Promise<CryptoKey> | null = null
function publicKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = crypto.subtle.importKey(
      'spki',
      b64urlToBytes(LICENSE_PUBLIC_KEY_B64).buffer as ArrayBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    )
  }
  return cachedKey
}

/**
 * Prüft Signatur + Struktur eines Tokens. Gibt die Claims zurück, wenn die
 * Signatur gültig ist (Ablauf wird hier NICHT geprüft – siehe
 * `licenseUsable`), sonst null.
 */
export async function verifyLicenseToken(token: string): Promise<LicenseClaims | null> {
  if (!LICENSE_PUBLIC_KEY_B64) return null
  const dot = token.indexOf('.')
  if (dot < 1) return null
  const payloadB64 = token.slice(0, dot)
  const sigB64 = token.slice(dot + 1)
  try {
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      await publicKey(),
      b64urlToBytes(sigB64).buffer as ArrayBuffer,
      new TextEncoder().encode(payloadB64),
    )
    if (!ok) return null
    const claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(payloadB64))) as LicenseClaims
    if (
      claims.v !== 1 ||
      typeof claims.email !== 'string' ||
      typeof claims.exp !== 'number' ||
      (claims.plan !== 'year' && claims.plan !== 'month' && claims.plan !== 'lifetime')
    ) {
      return null
    }
    return claims
  } catch {
    return null
  }
}

/**
 * Ist die Lizenz aktuell nutzbar? Signatur-gültige Claims vorausgesetzt.
 * Lifetime: immer. Abo: bis `exp`; danach noch `LICENSE_GRACE_DAYS`
 * Karenz (offline-freundlich, echte Revocation kommt per Server-Refresh).
 */
export function licenseUsable(claims: LicenseClaims, nowMs: number = Date.now()): boolean {
  const now = Math.floor(nowMs / 1000)
  if (claims.plan === 'lifetime') return now < claims.exp
  return now < claims.exp + LICENSE_GRACE_DAYS * 86400
}

/** True, wenn das Abo abgelaufen ist und ein Server-Refresh sinnvoll wäre. */
export function licenseNeedsRefresh(claims: LicenseClaims, nowMs: number = Date.now()): boolean {
  if (claims.plan === 'lifetime') return false
  return Math.floor(nowMs / 1000) >= claims.exp
}
