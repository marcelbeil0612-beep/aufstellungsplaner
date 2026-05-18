// POST /api/refresh-license  { token }
// Verlängert ein abgelaufenes Abo, wenn die Paddle-Subscription noch
// aktiv ist. Lifetime → idempotent neu ausgestellt. Gekündigt → 410.
import { LIFETIME_EXP, signLicense, verifyLicenseServer } from '../server/licenseSign.mjs'

const apiBase = () =>
  (process.env.PADDLE_API_ENV === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com')

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
      const fresh = signLicense(
        { v: 1, email: claims.email, plan: 'lifetime', exp: LIFETIME_EXP(), iat },
        priv,
      )
      res.statusCode = 200
      return res.end(JSON.stringify({ token: fresh, plan: 'lifetime' }))
    }

    if (!claims.sub) {
      res.statusCode = 422
      return res.end(JSON.stringify({ error: 'no_subscription' }))
    }
    const r = await fetch(apiBase() + `/subscriptions/${claims.sub}`, {
      headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
    })
    if (!r.ok) throw new Error(`Paddle subscription → ${r.status}`)
    const s = (await r.json()).data
    if (!['active', 'trialing', 'past_due'].includes(s.status)) {
      res.statusCode = 410
      return res.end(JSON.stringify({ error: 'subscription_inactive', status: s.status }))
    }
    const ends = s.current_billing_period?.ends_at ?? s.next_billed_at
    const exp = ends ? Math.floor(new Date(ends).getTime() / 1000) : iat + 35 * 86400
    const fresh = signLicense(
      { v: 1, email: claims.email, plan: claims.plan, exp, iat, sub: claims.sub },
      priv,
    )
    res.statusCode = 200
    return res.end(JSON.stringify({ token: fresh, plan: claims.plan }))
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'refresh_failed', message: String(e?.message ?? e) }))
  }
}
