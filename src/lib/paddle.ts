import { PADDLE_CLIENT_TOKEN, PADDLE_ENV, PADDLE_PRICE_IDS, type PlanId } from './billing'

// Minimal-Typisierung von Paddle.js v2 (per CDN geladen, keine npm-Dep).
type PaddleEvent = { name?: string; data?: { transaction_id?: string } }
type Paddle = {
  Environment: { set: (e: 'sandbox' | 'production') => void }
  Initialize: (o: { token: string; eventCallback?: (e: PaddleEvent) => void }) => void
  Checkout: {
    open: (o: {
      items: Array<{ priceId: string; quantity: number }>
      customer?: { email?: string }
      settings?: Record<string, unknown>
    }) => void
  }
}
declare global {
  interface Window {
    Paddle?: Paddle
  }
}

const SRC = 'https://cdn.paddle.com/paddle/v2/paddle.js'
let ready: Promise<Paddle> | null = null

/** Callback für die zuletzt geöffnete Checkout-Sitzung. */
let onCompletedOnce: ((transactionId: string) => void) | null = null

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Paddle) return resolve()
    const existing = document.querySelector(`script[src="${SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('paddle_load_failed')))
      return
    }
    const s = document.createElement('script')
    s.src = SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('paddle_load_failed'))
    document.head.appendChild(s)
  })
}

/** Lädt + initialisiert Paddle.js einmalig. */
export function loadPaddle(): Promise<Paddle> {
  if (!ready) {
    ready = (async () => {
      await loadScript()
      const P = window.Paddle
      if (!P) throw new Error('paddle_unavailable')
      if (PADDLE_ENV === 'sandbox') P.Environment.set('sandbox')
      P.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (e) => {
          if (e.name === 'checkout.completed' && e.data?.transaction_id) {
            const cb = onCompletedOnce
            onCompletedOnce = null
            cb?.(e.data.transaction_id)
          }
        },
      })
      return P
    })()
  }
  return ready
}

/**
 * Öffnet das Paddle-Checkout-Overlay für einen Plan. `onCompleted` wird
 * mit der Paddle-Transaction-ID aufgerufen, sobald die Zahlung steht.
 */
export async function openCheckout(
  plan: PlanId,
  onCompleted: (transactionId: string) => void,
  email?: string,
): Promise<void> {
  const P = await loadPaddle()
  onCompletedOnce = onCompleted
  P.Checkout.open({
    items: [{ priceId: PADDLE_PRICE_IDS[plan], quantity: 1 }],
    ...(email ? { customer: { email } } : {}),
    settings: { displayMode: 'overlay', theme: 'dark', allowLogout: false },
  })
}
