// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { createHmac } from 'node:crypto'
import handler from './paddle-webhook.mjs'

const SECRET = 'test-webhook-secret-abc123'

beforeAll(() => {
  process.env.PADDLE_WEBHOOK_SECRET = SECRET
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function sign(raw) {
  const ts = String(Math.floor(Date.now() / 1000))
  const hmac = createHmac('sha256', SECRET).update(`${ts}:${raw}`).digest('hex')
  return `ts=${ts};h1=${hmac}`
}

function makeReq(body, sig, method = 'POST') {
  const raw = typeof body === 'string' ? body : JSON.stringify(body)
  const buf = Buffer.from(raw)
  return {
    method,
    headers: { 'paddle-signature': sig ?? sign(raw) },
    [Symbol.asyncIterator]: async function* () { yield buf },
  }
}

function makeRes() {
  let body = ''
  return {
    statusCode: 200,
    setHeader() {},
    end(b) { body = b },
    text() { return body },
    json() { return JSON.parse(body) },
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/paddle-webhook – Methoden', () => {
  it('405 für GET', async () => {
    const res = makeRes()
    await handler(makeReq('{}', sign('{}'), 'GET'), res)
    expect(res.statusCode).toBe(405)
  })

  it('405 für PUT', async () => {
    const res = makeRes()
    await handler(makeReq('{}', sign('{}'), 'PUT'), res)
    expect(res.statusCode).toBe(405)
  })
})

describe('POST /api/paddle-webhook – HMAC-Signatur-Prüfung', () => {
  it('401 wenn paddle-signature Header fehlt', async () => {
    const raw = JSON.stringify({ event_type: 'test' })
    const buf = Buffer.from(raw)
    const req = {
      method: 'POST',
      headers: {},
      [Symbol.asyncIterator]: async function* () { yield buf },
    }
    const res = makeRes()
    await handler(req, res)
    expect(res.statusCode).toBe(401)
  })

  it('401 bei komplett falschem Signatur-Header', async () => {
    const res = makeRes()
    await handler(makeReq('{}', 'ts=1;h1=badhash'), res)
    expect(res.statusCode).toBe(401)
  })

  it('401 wenn HMAC mit falschem Secret berechnet wurde', async () => {
    const raw = JSON.stringify({ event_type: 'test' })
    const ts = String(Math.floor(Date.now() / 1000))
    const badHmac = createHmac('sha256', 'wrong-secret').update(`${ts}:${raw}`).digest('hex')
    const sig = `ts=${ts};h1=${badHmac}`
    const res = makeRes()
    await handler(makeReq(raw, sig), res)
    expect(res.statusCode).toBe(401)
  })

  it('401 wenn Body nach Signierung verändert wurde', async () => {
    const original = JSON.stringify({ event_type: 'test', data: {} })
    const sig = sign(original)
    // Anderer Body, gleiche Signatur → ungültig
    const tampered = JSON.stringify({ event_type: 'test', data: { injected: true } })
    const buf = Buffer.from(tampered)
    const req = {
      method: 'POST',
      headers: { 'paddle-signature': sig },
      [Symbol.asyncIterator]: async function* () { yield buf },
    }
    const res = makeRes()
    await handler(req, res)
    expect(res.statusCode).toBe(401)
  })

  it('401 wenn ts oder h1 im Header fehlen', async () => {
    const res1 = makeRes()
    await handler(makeReq('{}', 'h1=abc'), res1)
    expect(res1.statusCode).toBe(401)

    const res2 = makeRes()
    await handler(makeReq('{}', 'ts=123'), res2)
    expect(res2.statusCode).toBe(401)
  })

  it('200 bei gültiger Signatur', async () => {
    const body = { event_type: 'transaction.completed', data: {} }
    const res = makeRes()
    await handler(makeReq(body), res)
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ ok: true })
  })
})

describe('POST /api/paddle-webhook – Event-Handling', () => {
  it('200 für normalen Event (transaction.completed)', async () => {
    const res = makeRes()
    await handler(makeReq({ event_type: 'transaction.completed', data: {} }), res)
    expect(res.statusCode).toBe(200)
  })

  it('200 für Erstattungs-Event (transaction.refunded) – wird geloggt, aber nicht geblockt', async () => {
    // Revocation-Durchsetzung erfolgt beim nächsten Token-Refresh, nicht hier.
    const body = {
      event_type: 'transaction.refunded',
      data: { id: 'adj_1', transaction_id: 'txn_1', status: 'approved', action: 'refund' },
    }
    const res = makeRes()
    await handler(makeReq(body), res)
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ ok: true })
  })

  it('200 für alle Revocation-Events (werden nur geloggt)', async () => {
    const revocationEvents = [
      'transaction.refunded',
      'transaction.canceled',
      'adjustment.created',
      'adjustment.updated',
      'subscription.canceled',
      'subscription.paused',
    ]
    for (const event_type of revocationEvents) {
      const res = makeRes()
      await handler(makeReq({ event_type, data: {} }), res)
      expect(res.statusCode).toBe(200)
    }
  })

  it('200 für unbekannte Event-Typen', async () => {
    const res = makeRes()
    await handler(makeReq({ event_type: 'unknown.event', data: {} }), res)
    expect(res.statusCode).toBe(200)
  })

  it('200 auch wenn Body kein valides JSON ist – nach Signatur-Prüfung nicht abstürzen', async () => {
    // Signatur muss zum raw body passen (kein JSON, aber gültiger Body)
    const raw = 'not-json'
    const res = makeRes()
    await handler(makeReq(raw, sign(raw)), res)
    // Signatur gültig, JSON-Parse schlägt fehl → try/catch → trotzdem 200
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ ok: true })
  })

  it('200 wenn event_type fehlt (unvollständiger Webhook)', async () => {
    const body = { data: { id: 'x' } } // kein event_type
    const res = makeRes()
    await handler(makeReq(body), res)
    expect(res.statusCode).toBe(200)
  })
})
