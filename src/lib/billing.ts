/**
 * Zentrale, env-gesteuerte Billing-Konfiguration (Paddle).
 * Ohne gesetzte Variablen ist Billing „nicht konfiguriert“ → die Paywall
 * bleibt im Hinweis-Zustand, nichts bricht (lokale Dev ohne Credentials).
 */

export type PlanId = 'year' | 'month' | 'lifetime'

const env = import.meta.env

export const PADDLE_ENV: 'sandbox' | 'production' =
  env.VITE_PADDLE_ENV === 'production' ? 'production' : 'sandbox'

export const PADDLE_CLIENT_TOKEN = env.VITE_PADDLE_CLIENT_TOKEN ?? ''

export const PADDLE_PRICE_IDS: Record<PlanId, string> = {
  year: env.VITE_PADDLE_PRICE_YEAR ?? '',
  month: env.VITE_PADDLE_PRICE_MONTH ?? '',
  lifetime: env.VITE_PADDLE_PRICE_LIFETIME ?? '',
}

export const LICENSE_PUBLIC_KEY_B64 = env.VITE_LICENSE_PUBLIC_KEY ?? ''

/** Checkout möglich? (Client-Token + alle drei Preis-IDs vorhanden) */
export const isBillingConfigured = (): boolean =>
  PADDLE_CLIENT_TOKEN.length > 0 &&
  PADDLE_PRICE_IDS.year.length > 0 &&
  PADDLE_PRICE_IDS.month.length > 0 &&
  PADDLE_PRICE_IDS.lifetime.length > 0

/** Lizenz-Verifikation möglich? (öffentlicher Schlüssel vorhanden) */
export const isLicenseVerifiable = (): boolean => LICENSE_PUBLIC_KEY_B64.length > 0
