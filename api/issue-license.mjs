// POST /api/issue-license  { transactionId }
// Verifiziert die Paddle-Transaktion serverseitig und stellt einen
// signierten Lizenz-Token aus. Sandbox/Prod via PADDLE_API_ENV.
import { LIFETIME_EXP, signLicense } from '../server/licenseSign.mjs'

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

function planForPrice(priceId) {
  if (priceId && priceId === process.env.PADDLE_PRICE_YEAR) return 'year'
  if (priceId && priceId === process.env.PADDLE_PRICE_MONTH) return 'month'
  if (priceId && priceId === process.env.PADDLE_PRICE_LIFETIME) return 'lifetime'
  return null
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
  if (!process.env.PADDLE_API_KEY || !process.env.LICENSE_PRIVATE_KEY) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'billing_not_configured' }))
  }
  try {
    const { transactionId } = await readJson(req)
    if (!transactionId || typeof transactionId !== 'string') {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'missing_transaction_id' }))
    }

    const txn = await pget(`/transactions/${encodeURIComponent(transactionId)}`)
    const paid = ['completed', 'paid', 'billed'].includes(txn.status)
    if (!paid) {
      res.statusCode = 402
      return res.end(JSON.stringify({ error: 'transaction_not_paid', status: txn.status }))
    }

    const priceId = txn.items?.[0]?.price?.id ?? txn.details?.line_items?.[0]?.price_id
    const plan = planForPrice(priceId)
    if (!plan) {
      res.statusCode = 422
      return res.end(JSON.stringify({ error: 'unknown_price', priceId }))
    }

    const customer = txn.customer_id ? await pget(`/customers/${txn.customer_id}`) : null
    const email = customer?.email ?? txn.details?.customer?.email ?? ''

    let exp = LIFETIME_EXP()
    let sub
    if (plan !== 'lifetime' && txn.subscription_id) {
      sub = txn.subscription_id
      const s = await pget(`/subscriptions/${txn.subscription_id}`)
      const ends = s.current_billing_period?.ends_at ?? s.next_billed_at
      if (ends) exp = Math.floor(new Date(ends).getTime() / 1000)
    }

    const iat = Math.floor(Date.now() / 1000)
    const token = signLicense(
      { v: 1, email, plan, exp, iat, ...(sub ? { sub } : {}) },
      process.env.LICENSE_PRIVATE_KEY,
    )
    res.statusCode = 200
    return res.end(JSON.stringify({ token, plan }))
  } catch (e) {
    res.statusCode = 500
    return res.end(JSON.stringify({ error: 'issue_failed', message: String(e?.message ?? e) }))
  }
}
