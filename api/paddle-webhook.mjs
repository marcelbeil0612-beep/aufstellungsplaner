// POST /api/paddle-webhook
// Verifiziert die Paddle-Signatur (HMAC-SHA256 über `ts:rawBody`) und
// protokolliert erstattungs-/kündigungsrelevante Events sichtbar in den
// Vercel-Logs (Monitoring/Missbrauchssicht). Die Durchsetzung selbst
// läuft über api/refresh-license (Paddle als Wahrheitsquelle, rollierende
// Token + 90-Tage-Karenz). Echtzeit-Push-Revocation (Sperrliste) wäre
// der nächste Ausbau – hier bewusst noch nicht, um ohne zusätzliche
// Infrastruktur auszukommen.
import { createHmac, timingSafeEqual } from 'node:crypto'

async function readRaw(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  return Buffer.concat(chunks).toString('utf8')
}

function verify(sigHeader, raw, secret) {
  if (!sigHeader || !secret) return false
  const parts = Object.fromEntries(
    sigHeader.split(';').map((kv) => kv.split('=')),
  )
  const ts = parts.ts
  const h1 = parts.h1
  if (!ts || !h1) return false
  const expected = createHmac('sha256', secret).update(`${ts}:${raw}`).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(h1), Buffer.from(expected))
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.end('method_not_allowed')
  }
  const raw = await readRaw(req)
  const sig = req.headers['paddle-signature']
  if (!verify(sig, raw, process.env.PADDLE_WEBHOOK_SECRET)) {
    res.statusCode = 401
    return res.end('invalid_signature')
  }
  // Signatur gültig. Erstattungs-/Kündigungs-Events deutlich loggen,
  // damit Missbrauch (Kauf → Widerruf → Weiternutzung) in den Vercel-
  // Logs sichtbar ist; der Entzug erfolgt beim nächsten Token-Refresh.
  try {
    const evt = JSON.parse(raw)
    const type = evt?.event_type ?? 'unknown'
    const REVOCATION_EVENTS = new Set([
      'transaction.refunded',
      'transaction.canceled',
      'adjustment.created',
      'adjustment.updated',
      'subscription.canceled',
      'subscription.paused',
    ])
    if (REVOCATION_EVENTS.has(type)) {
      const d = evt?.data ?? {}
      console.warn(
        '[paddle-webhook] REVOCATION-RELEVANT',
        type,
        JSON.stringify({
          id: d.id,
          transaction_id: d.transaction_id,
          subscription_id: d.subscription_id,
          status: d.status,
          action: d.action,
        }),
      )
    } else {
      console.log('[paddle-webhook]', type)
    }
  } catch {
    /* ignorieren */
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ ok: true }))
}
