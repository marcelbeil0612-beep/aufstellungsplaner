import type { PlanId } from './billing'
import { isLicenseVerifiable } from './billing'
import { licenseNeedsRefresh, licenseUsable, verifyLicenseToken } from './license'
import { openCheckout } from './paddle'
import { useLineupStore } from '../store/useLineupStore'

/**
 * Bindeglied zwischen Lizenz, Paddle und Store. Kapselt: gespeicherte
 * Lizenz beim Start aktivieren, Lizenzschlüssel einlösen, Kauf →
 * Lizenz → Pro.
 */

async function refreshIfNeeded(token: string): Promise<void> {
  try {
    const res = await fetch('/api/refresh-license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (res.status === 410) {
      // Abo serverseitig beendet → Pro entziehen.
      useLineupStore.getState().setLicense(null)
      useLineupStore.getState().setProStatus(false)
      return
    }
    if (!res.ok) return
    const data = (await res.json()) as { token?: string }
    if (data.token) {
      useLineupStore.getState().setLicense(data.token)
      useLineupStore.getState().setProStatus(true)
    }
  } catch {
    /* offline o. Ä. – Karenz greift, kein Downgrade */
  }
}

/** Beim App-Start: gespeicherte Lizenz prüfen und Pro setzen. */
export async function activateFromStoredLicense(): Promise<void> {
  if (!isLicenseVerifiable()) return
  const token = useLineupStore.getState().license
  if (!token) return
  const claims = await verifyLicenseToken(token)
  if (!claims) {
    useLineupStore.getState().setProStatus(false)
    return
  }
  if (licenseUsable(claims)) {
    useLineupStore.getState().setProStatus(true)
    if (licenseNeedsRefresh(claims)) void refreshIfNeeded(token)
  } else {
    useLineupStore.getState().setProStatus(false)
    void refreshIfNeeded(token)
  }
}

/** Manuell eingegebenen Lizenzschlüssel einlösen. */
export async function redeemLicense(
  raw: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const token = raw.trim()
  if (!token) return { ok: false, reason: 'Bitte einen Lizenzschlüssel eingeben.' }
  if (!isLicenseVerifiable()) return { ok: false, reason: 'Lizenzprüfung derzeit nicht verfügbar.' }
  const claims = await verifyLicenseToken(token)
  if (!claims) return { ok: false, reason: 'Ungültiger Lizenzschlüssel.' }
  if (!licenseUsable(claims)) return { ok: false, reason: 'Lizenz abgelaufen.' }
  useLineupStore.getState().setLicense(token)
  useLineupStore.getState().setProStatus(true)
  return { ok: true }
}

/** Checkout öffnen und nach Zahlung automatisch freischalten. */
export async function purchaseAndActivate(
  plan: PlanId,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  return new Promise((resolve) => {
    openCheckout(plan, async (transactionId) => {
      try {
        const res = await fetch('/api/issue-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId }),
        })
        const data = (await res.json()) as { token?: string; error?: string }
        if (!res.ok || !data.token) {
          resolve({ ok: false, reason: data.error ?? 'Lizenz konnte nicht erstellt werden.' })
          return
        }
        useLineupStore.getState().setLicense(data.token)
        useLineupStore.getState().setProStatus(true)
        resolve({ ok: true })
      } catch {
        resolve({ ok: false, reason: 'Netzwerkfehler bei der Freischaltung.' })
      }
    }).catch(() => resolve({ ok: false, reason: 'Checkout konnte nicht geöffnet werden.' }))
  })
}
