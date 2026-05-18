// Serverseitige Lizenz-Signatur (ECDSA P-256, raw/IEEE-P1363).
// Wird von den Vercel-Functions und vom Test-Skript genutzt.
// Plain ESM mit JSDoc, damit es ohne Build sowohl in .ts-Functions
// (via esbuild) als auch in node-Skripten importierbar ist.
import {
  createPrivateKey,
  createPublicKey,
  sign as nodeSign,
  verify as nodeVerify,
} from 'node:crypto'

/** Buffer → base64url (ohne Padding). */
export function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Signiert Lizenz-Claims und gibt `payloadB64.sigB64` zurück.
 * @param {{v:1,email:string,plan:'year'|'month'|'lifetime',exp:number,iat:number,sub?:string}} claims
 * @param {string} privateKeyB64  PKCS8-DER, base64 (LICENSE_PRIVATE_KEY)
 */
export function signLicense(claims, privateKeyB64) {
  const key = createPrivateKey({
    key: Buffer.from(privateKeyB64, 'base64'),
    format: 'der',
    type: 'pkcs8',
  })
  const payloadB64 = b64url(JSON.stringify(claims))
  const sig = nodeSign('sha256', Buffer.from(payloadB64, 'utf8'), {
    key,
    dsaEncoding: 'ieee-p1363',
  })
  return `${payloadB64}.${b64url(sig)}`
}

/**
 * Verifiziert einen Token serverseitig (öffentlicher Schlüssel wird aus
 * dem Private Key abgeleitet) und gibt die Claims zurück oder null.
 * @param {string} token
 * @param {string} privateKeyB64
 */
export function verifyLicenseServer(token, privateKeyB64) {
  try {
    const dot = token.indexOf('.')
    if (dot < 1) return null
    const payloadB64 = token.slice(0, dot)
    const sigB64 = token.slice(dot + 1)
    const pub = createPublicKey(
      createPrivateKey({
        key: Buffer.from(privateKeyB64, 'base64'),
        format: 'der',
        type: 'pkcs8',
      }),
    )
    const ok = nodeVerify(
      'sha256',
      Buffer.from(payloadB64, 'utf8'),
      { key: pub, dsaEncoding: 'ieee-p1363' },
      Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
    )
    if (!ok) return null
    return JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'))
  } catch {
    return null
  }
}

/** Lifetime-Ablauf: ~100 Jahre in der Zukunft (praktisch unbegrenzt). */
export const LIFETIME_EXP = () => Math.floor(Date.now() / 1000) + 100 * 365 * 86400
