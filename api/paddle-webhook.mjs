// POST /api/paddle-webhook
// Verifiziert die Paddle-Signatur (HMAC-SHA256 über `ts:rawBody`).
// MVP: Signaturprüfung + 200. Abo-Lebenszyklus (Kündigung sofort
// propagieren) ist bewusst zurückgestellt – die clientseitige
// Ablauf-/Refresh-Logik (api/refresh-license + 90-Tage-Karenz) deckt
// den praktischen Fall ab. Hier ist der Hook für späteren Ausbau.
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
  // Signatur gültig. Eventtyp wird (noch) nicht weiterverarbeitet.
  try {
    const evt = JSON.parse(raw)
    console.log('[paddle-webhook]', evt?.event_type ?? 'unknown')
  } catch {
    /* ignorieren */
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ ok: true }))
}
