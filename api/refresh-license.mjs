// POST /api/refresh-license  { token }
// Verlängert ein abgelaufenes Abo, wenn die Paddle-Subscription noch
// aktiv ist. Lifetime → gegen die Original-Transaktion auf Erstattung
// geprüft und (falls sauber) mit rollierendem Ablauf neu ausgestellt.
// Erstattet/storniert/gekündigt → 410.
import { rollingExp, signLicense, verifyLicenseServer } from '../server/licenseSign.mjs'

const apiBase = () =>
  (process.env.PADDLE_API_ENV === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com')

async function pget(path) {
  const r = await fetch(apiBase() + path, {
    headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
  })
  if (!r.ok) throw new Error(`Paddle ${path} → ${r.status}`)
  return (await r.json()).data
}

/**
 * Ist die Original-Transaktion erstattet/storniert? Quelle: Paddle
 * Adjustments (refund/credit/chargeback) + Transaktionsstatus.
 * Bei Unsicherheit (API-Fehler) wird NICHT gesperrt – der Aufrufer
 * behandelt das offline-freundlich.
 */
async function transactionRevoked(txnId) {
  const txn = await pget(`/transactions/${encodeURIComponent(txnId)}`)
  if (txn?.status === 'canceled') return true
  const adj = await pget(`/adjustments?transaction_id=${encodeURIComponent(txnId)}`)
  return (
    Array.isArray(adj) &&
    adj.some(
      (a) =>
        ['refund', 'credit', 'chargeback'].includes(a?.action) &&
        ['pending', 'approved'].includes(a?.status),
    )
  )
}

async function readJson(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.end(JSON.stringify({ error: 'method_not_allowed' }))
  }
  const priv = process.env.LICENSE_PRIVATE_KEY
  if (!priv || !process.env.PADDLE_API_KEY) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'billing_not_configured' }))
  }
  try {
    const { token } = await readJson(req)
    const claims = token ? verifyLicenseServer(token, priv) : null
    if (!claims) {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'invalid_token' }))
    }

    const iat = Math.floor(Date.now() / 1000)
    if (claims.plan === 'lifetime') {
      if (claims.txn) {
        let revoked = false
        try {
          revoked = await transactionRevoked(claims.txn)
        } catch (e) {
          // Paddle nicht erreichbar → NICHT sperren (offline-freundlich);
          // beim nächsten Refresh wird erneut geprüft.
          console.warn('[refresh-license] lifetime check failed:', String(e?.message ?? e))
        }
        if (revoked) {
          res.statusCode = 410
          return res.end(JSON.stringify({ error: 'transaction_refunded' }))
        }
      } else {
        // Alt-Token ohne `txn` (vor dieser Version) → nicht prüfbar,
        // bewusst kein Lockout. Neue Käufe tragen immer `txn`.
        console.warn('[refresh-license] lifetime token without txn – cannot verify refund')
      }
      const fresh = signLicense(
        {
          v: 1,
          email: claims.email,
          plan: 'lifetime',
          exp: rollingExp(),
          iat,
          ...(claims.txn ? { txn: claims.txn } : {}),
        },
        priv,
      )
      res.statusCode = 200
      return res.end(JSON.stringify({ token: fresh, plan: 'lifetime' }))
    }

    if (!claims.sub) {
      res.statusCode = 422
      return res.end(JSON.stringify({ error: 'no_subscription' }))
    }
    const s = await pget(`/subscriptions/${encodeURIComponent(claims.sub)}`)
    if (!['active', 'trialing', 'past_due'].includes(s.status)) {
      res.statusCode = 410
      return res.end(JSON.stringify({ error: 'subscription_inactive', status: s.status }))
    }
    const ends = s.current_billing_period?.ends_at ?? s.next_billed_at
    const exp = ends ? Math.floor(new Date(ends).getTime() / 1000) : rollingExp()
    const fresh = signLicense(
      {
        v: 1,
        email: claims.email,
        plan: claims.plan,
        exp,
        iat,
        sub: claims.sub,
        ...(claims.txn ? { txn: claims.txn } : {}),
      },
      priv,
    )
    res.statusCode = 200
    return res.end(JSON.stringify({ token: fresh, plan: claims.plan }))
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'refresh_failed', message: String(e?.message ?? e) }))
  }
}
