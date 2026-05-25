import { useEffect, useState } from 'react'
import { isBillingConfigured, type PlanId } from '../lib/billing'
import { useProStatus, type ProFeature } from '../lib/proAccess'
import { purchaseAndActivate, redeemLicense } from '../lib/proActivation'
import { usePaywallStore } from '../store/paywallStore'
import { useLineupStore } from '../store/useLineupStore'
import { Modal } from './Modal'

/** Worauf der Nutzer geklickt hat → konkrete Anreißzeile im Dialog. */
const featureLead: Record<ProFeature, string> = {
  'systembuch-full': 'das vollständige Systembuch (alle 81 Duelle)',
  'phase-without-ball': 'die Phase „Gegen den Ball"',
  'auto-lineup': 'die automatische Beste-Aufstellung',
  substitutions: 'den Wechselplan',
  'multi-team': 'mehrere Mannschaften',
  'share-import': 'den Import geteilter Aufstellungen',
  'backup-import': 'den Backup-Import',
}

const PRO_FEATURES: string[] = [
  'Alle 81 Systembuch-Duelle (statt 3 Schaufenster-Duellen)',
  'Phasen-Umschalter „Gegen den Ball"',
  'Beste Aufstellung automatisch nach Skill-Score',
  'Wechselplan für den Spieltag',
  'Mehrere Mannschaften (2–5 lokal)',
  'Import geteilter Aufstellungen & Backups',
]

type Plan = {
  id: PlanId
  name: string
  price: string
  per: string
  note: string
  recommended?: boolean
}

const PLANS: Plan[] = [
  { id: 'year', name: 'Jahresabo', price: '€24,90', per: '/ Jahr', note: 'Bester Preis pro Monat', recommended: true },
  { id: 'month', name: 'Monatsabo', price: '€3,90', per: '/ Monat', note: 'Jederzeit kündbar' },
  { id: 'lifetime', name: 'Lifetime · Early Supporter', price: '€49', per: 'einmalig', note: 'Limitiert auf die ersten 100 Nutzer' },
]

export function PaywallDialog() {
  const feature = usePaywallStore((s) => s.feature)
  const showLicense = usePaywallStore((s) => s.showLicense)
  const dismiss = usePaywallStore((s) => s.dismiss)
  const billing = isBillingConfigured()
  const isPro = useProStatus()
  const license = useLineupStore((s) => s.license)

  const [busy, setBusy] = useState<PlanId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showRedeem, setShowRedeem] = useState(false)
  const [licenseInput, setLicenseInput] = useState('')
  const [copied, setCopied] = useState(false)

  const open = feature !== null || showLicense
  // Pro-Nutzer (oder explizit „Lizenz anzeigen") sehen ihren Schlüssel zum
  // Kopieren — statt der Upgrade-UI. So lässt sich Pro auf weiteren Geräten
  // über „Lizenzschlüssel einlösen" freischalten.
  const licenseView = showLicense || isPro

  useEffect(() => {
    if (!open) {
      setBusy(null)
      setError(null)
      setShowRedeem(false)
      setLicenseInput('')
      setCopied(false)
    }
  }, [open])

  const handleBuy = async (plan: PlanId) => {
    if (!billing) return
    setError(null)
    setBusy(plan)
    const r = await purchaseAndActivate(plan)
    setBusy(null)
    if (r.ok) dismiss()
    else setError(r.reason)
  }

  const handleRedeem = async () => {
    setError(null)
    const r = await redeemLicense(licenseInput)
    if (r.ok) dismiss()
    else setError(r.reason)
  }

  const handleCopy = async () => {
    if (!license) return
    try {
      await navigator.clipboard.writeText(license)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* Clipboard nicht verfügbar — Nutzer kann den Schlüssel manuell markieren. */
    }
  }

  return (
    <Modal
      open={open}
      onClose={dismiss}
      title={licenseView ? 'Deine Pro-Lizenz' : 'Mit Pro freischalten'}
      subtitle={
        licenseView
          ? 'Du hast FormaXI Pro. Hier dein Schlüssel zum Freischalten weiterer Geräte.'
          : feature
            ? `Du wolltest ${featureLead[feature]} öffnen – das gehört zu Pro.`
            : undefined
      }
      size="xl"
    >
      {licenseView ? (
        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-5">
          {license ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="lic-show">
                Dein Lizenzschlüssel
              </label>
              <textarea
                id="lic-show"
                readOnly
                value={license}
                rows={4}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="self-start rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                {copied ? '✓ Kopiert' : 'Lizenzschlüssel kopieren'}
              </button>
            </div>
          ) : (
            <p className="rounded-lg border border-amber-500/40 bg-amber-950/50 px-3 py-2 text-xs text-amber-200">
              Lizenz aktuell nicht verfügbar. Bitte die Seite neu laden — wenn
              das Problem bleibt, melde dich.
            </p>
          )}

          <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-3 text-xs text-slate-300">
            <p className="mb-1 font-semibold text-slate-200">
              So schaltest du Pro auf einem weiteren Gerät frei:
            </p>
            <ol className="ml-4 list-decimal space-y-0.5">
              <li>FormaXI auf dem anderen Gerät öffnen.</li>
              <li>Eine Pro-Funktion antippen (z. B. „Auto-Aufstellung" oder „Gegen den Ball").</li>
              <li>Im Dialog auf „Schon gekauft? Lizenzschlüssel einlösen".</li>
              <li>Schlüssel einfügen → „Einlösen". Pro ist dann auch dort aktiv.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <p className="text-[11px] text-slate-500">
              Behandle den Schlüssel wie ein Passwort — wer ihn hat, schaltet
              Pro frei.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Schließen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Pro umfasst:</p>
            <ul className="space-y-1.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span aria-hidden className="mt-0.5 text-emerald-400">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                disabled={busy !== null}
                onClick={() => (billing ? handleBuy(plan.id) : setError('__stub__'))}
                className={[
                  'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition disabled:opacity-60',
                  plan.recommended
                    ? 'border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-900/60 hover:bg-slate-800',
                ].join(' ')}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{plan.name}</span>
                <span className="text-lg font-bold text-white">
                  {plan.price} <span className="text-xs font-normal text-slate-400">{plan.per}</span>
                </span>
                <span className="text-[11px] text-slate-500">{plan.note}</span>
                {busy === plan.id ? (
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Checkout läuft …
                  </span>
                ) : plan.recommended ? (
                  <span className="mt-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                    Empfohlen
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {error === '__stub__' ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-950/50 px-3 py-2 text-xs text-amber-200">
              Die Bezahlung wird gerade eingerichtet. Danke für dein Interesse –
              du kannst Pro hier in Kürze freischalten.
            </p>
          ) : error ? (
            <p className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="border-t border-slate-800 pt-3">
            {showRedeem ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400" htmlFor="lic">
                  Lizenzschlüssel einlösen
                </label>
                <div className="flex gap-2">
                  <input
                    id="lic"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    placeholder="Lizenzschlüssel einfügen"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRedeem}
                    className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    Einlösen
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setError(null); setShowRedeem(true) }}
                className="text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
              >
                Schon gekauft? Lizenzschlüssel einlösen
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <p className="text-[11px] text-slate-500">
              Ohne Cloud · ohne Tracker · einmal kaufen, lokal nutzen.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Vielleicht später
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
