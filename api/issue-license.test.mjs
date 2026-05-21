// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import handler from './issue-license.mjs'
import { verifyLicenseServer } from '../server/licenseSign.mjs'

const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
const PRIV = privateKey.export({ format: 'der', type: 'pkcs8' }).toString('base64')

const PRICE_YEAR = 'pri_test_year'
const PRICE_MONTH = 'pri_test_month'
const PRICE_LIFETIME = 'pri_test_lifetime'

beforeAll(() => {
  process.env.PADDLE_API_KEY = 'test-api-key'
  process.env.LICENSE_PRIVATE_KEY = PRIV
  process.env.PADDLE_API_ENV = 'sandbox'
  process.env.PADDLE_PRICE_YEAR = PRICE_YEAR
  process.env.PADDLE_PRICE_MONTH = PRICE_MONTH
  process.env.PADDLE_PRICE_LIFETIME = PRICE_LIFETIME
})

afterEach(() => vi.unstubAllGlobals())

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeReq(method = 'POST', body = {}) {
  const buf = Buffer.from(JSON.stringify(body))
  return {
    method,
    headers: {},
    [Symbol.asyncIterator]: async function* () { yield buf },
  }
}

function makeRes() {
  let body = ''
  return {
    statusCode: 200,
    setHeader() {},
    end(b) { body = b },
    json() { return JSON.parse(body) },
  }
}

/**
 * Mockt globales fetch mit einer geordneten Liste von Antworten.
 * Jede pget()-Call verbraucht die nächste Antwort in der Liste.
 */
function mockFetch(...responses) {
  let i = 0
  vi.stubGlobal('fetch', async () => {
    const r = responses[i++] ?? { ok: false, status: 404, data: null }
    return {
      ok: r.ok !== false,
      status: r.status ?? 200,
      json: async () => ({ data: r.data }),
    }
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/issue-license – Methoden und Konfiguration', () => {
  it('405 für nicht-POST Methoden', async () => {
    const res = makeRes()
    await handler(makeReq('GET'), res)
    expect(res.statusCode).toBe(405)
    expect(res.json().error).toBe('method_not_allowed')
  })

  it('500 wenn PADDLE_API_KEY fehlt', async () => {
    const saved = process.env.PADDLE_API_KEY
    delete process.env.PADDLE_API_KEY
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_1' }), res)
    expect(res.statusCode).toBe(500)
    expect(res.json().error).toBe('billing_not_configured')
    process.env.PADDLE_API_KEY = saved
  })

  it('500 wenn LICENSE_PRIVATE_KEY fehlt', async () => {
    const saved = process.env.LICENSE_PRIVATE_KEY
    delete process.env.LICENSE_PRIVATE_KEY
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_1' }), res)
    expect(res.statusCode).toBe(500)
    expect(res.json().error).toBe('billing_not_configured')
    process.env.LICENSE_PRIVATE_KEY = saved
  })
})

describe('POST /api/issue-license – Eingabe-Validierung', () => {
  it('400 wenn transactionId fehlt', async () => {
    const res = makeRes()
    await handler(makeReq('POST', {}), res)
    expect(res.statusCode).toBe(400)
    expect(res.json().error).toBe('missing_transaction_id')
  })

  it('400 wenn transactionId kein String ist', async () => {
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 42 }), res)
    expect(res.statusCode).toBe(400)
    expect(res.json().error).toBe('missing_transaction_id')
  })

  it('400 bei leerem Body (kein JSON)', async () => {
    const buf = Buffer.from('')
    const req = { method: 'POST', headers: {}, [Symbol.asyncIterator]: async function* () { yield buf } }
    const res = makeRes()
    await handler(req, res)
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /api/issue-license – Paddle-Verifikation', () => {
  it('402 wenn Transaktion den Status "pending" hat (noch nicht bezahlt)', async () => {
    mockFetch({ data: { status: 'pending', items: [], customer_id: null } })
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_pending' }), res)
    expect(res.statusCode).toBe(402)
    expect(res.json().error).toBe('transaction_not_paid')
    expect(res.json().status).toBe('pending')
  })

  it('402 für alle nicht-bezahlten Status (draft, ready)', async () => {
    for (const status of ['draft', 'ready']) {
      mockFetch({ data: { status, items: [], customer_id: null } })
      const res = makeRes()
      await handler(makeReq('POST', { transactionId: 'txn_' + status }), res)
      expect(res.statusCode).toBe(402)
    }
  })

  it('200 für alle bezahlten Status (completed, paid, billed)', async () => {
    for (const status of ['completed', 'paid', 'billed']) {
      mockFetch(
        { data: { status, items: [{ price: { id: PRICE_LIFETIME } }], customer_id: 'cus_1' } },
        { data: { email: 'x@x.de' } },
      )
      const res = makeRes()
      await handler(makeReq('POST', { transactionId: 'txn_' + status }), res)
      expect(res.statusCode).toBe(200)
    }
  })

  it('422 wenn priceId keinem bekannten Plan entspricht', async () => {
    mockFetch({
      data: { status: 'completed', items: [{ price: { id: 'pri_unknown' } }], customer_id: null },
    })
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_bad_price' }), res)
    expect(res.statusCode).toBe(422)
    expect(res.json().error).toBe('unknown_price')
  })
})

describe('POST /api/issue-license – Token-Ausstellung', () => {
  it('stellt gültigen signierten Token für Lifetime aus', async () => {
    mockFetch(
      { data: { status: 'completed', items: [{ price: { id: PRICE_LIFETIME } }], customer_id: 'cus_1' } },
      { data: { email: 'lifetime@example.com' } },
    )
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_lt' }), res)
    expect(res.statusCode).toBe(200)
    const { token, plan } = res.json()
    expect(plan).toBe('lifetime')
    const claims = verifyLicenseServer(token, PRIV)
    expect(claims).not.toBeNull()
    expect(claims.plan).toBe('lifetime')
    expect(claims.email).toBe('lifetime@example.com')
    expect(claims.txn).toBe('txn_lt')
    expect(typeof claims.exp).toBe('number')
    expect(claims.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })

  it('stellt gültigen Token für year-Abo aus (inkl. sub + Abo-Ablauf als exp)', async () => {
    const subEnds = new Date(Date.now() + 365 * 86400 * 1000).toISOString()
    mockFetch(
      { data: { status: 'completed', items: [{ price: { id: PRICE_YEAR } }], customer_id: 'cus_2', subscription_id: 'sub_year' } },
      { data: { email: 'year@example.com' } },
      { data: { current_billing_period: { ends_at: subEnds } } },
    )
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_year' }), res)
    expect(res.statusCode).toBe(200)
    const { token, plan } = res.json()
    expect(plan).toBe('year')
    const claims = verifyLicenseServer(token, PRIV)
    expect(claims.plan).toBe('year')
    expect(claims.sub).toBe('sub_year')
    expect(claims.txn).toBe('txn_year')
    // exp muss dem Abo-Enddatum entsprechen
    const expectedExp = Math.floor(new Date(subEnds).getTime() / 1000)
    expect(claims.exp).toBe(expectedExp)
  })

  it('stellt gültigen Token für month-Abo aus', async () => {
    const subEnds = new Date(Date.now() + 30 * 86400 * 1000).toISOString()
    mockFetch(
      { data: { status: 'completed', items: [{ price: { id: PRICE_MONTH } }], customer_id: 'cus_3', subscription_id: 'sub_month' } },
      { data: { email: 'month@example.com' } },
      { data: { next_billed_at: subEnds } }, // alternative API-Antwort (kein current_billing_period)
    )
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_month' }), res)
    expect(res.statusCode).toBe(200)
    const { token, plan } = res.json()
    expect(plan).toBe('month')
    const claims = verifyLicenseServer(token, PRIV)
    expect(claims.plan).toBe('month')
    expect(claims.sub).toBe('sub_month')
  })

  it('E-Mail wird aus Transaktion geholt wenn kein customer_id vorhanden', async () => {
    mockFetch({
      data: {
        status: 'completed',
        items: [{ price: { id: PRICE_LIFETIME } }],
        customer_id: null,
        details: { customer: { email: 'fallback@example.com' } },
      },
    })
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_nocust' }), res)
    expect(res.statusCode).toBe(200)
    const claims = verifyLicenseServer(res.json().token, PRIV)
    expect(claims.email).toBe('fallback@example.com')
  })

  it('priceId wird aus details.line_items geholt (Fallback-Pfad)', async () => {
    mockFetch({
      data: {
        status: 'completed',
        items: [], // kein items[0].price.id
        details: { line_items: [{ price_id: PRICE_LIFETIME }] },
        customer_id: null,
      },
    })
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_fallback_price' }), res)
    expect(res.statusCode).toBe(200)
    expect(res.json().plan).toBe('lifetime')
  })

  it('500 wenn Paddle API nicht erreichbar ist', async () => {
    vi.stubGlobal('fetch', async () => { throw new Error('network error') })
    const res = makeRes()
    await handler(makeReq('POST', { transactionId: 'txn_offline' }), res)
    expect(res.statusCode).toBe(500)
    expect(res.json().error).toBe('issue_failed')
  })
})
