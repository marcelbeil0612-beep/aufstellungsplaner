import { useEffect, useState } from 'react'
import type { ProFeature } from '../lib/proAccess'
import { usePaywallStore } from '../store/paywallStore'
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
  id: 'year' | 'month' | 'lifetime'
  name: string
  price: string
  per: string
  note: string
  recommended?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'year',
    name: 'Jahresabo',
    price: '€24,90',
    per: '/ Jahr',
    note: 'Bester Preis pro Monat',
    recommended: true,
  },
  { id: 'month', name: 'Monatsabo', price: '€3,90', per: '/ Monat', note: 'Jederzeit kündbar' },
  {
    id: 'lifetime',
    name: 'Lifetime · Early Supporter',
    price: '€49',
    per: 'einmalig',
    note: 'Limitiert auf die ersten 100 Nutzer',
  },
]

export function PaywallDialog() {
  const feature = usePaywallStore((s) => s.feature)
  const dismiss = usePaywallStore((s) => s.dismiss)
  const [checkoutNote, setCheckoutNote] = useState(false)

  const open = feature !== null

  // Hinweis zurücksetzen, sobald der Dialog wechselt/schließt.
  useEffect(() => {
    if (!open) setCheckoutNote(false)
  }, [open])

  return (
    <Modal
      open={open}
      onClose={dismiss}
      title="Mit Pro freischalten"
      subtitle={
        feature
          ? `Du wolltest ${featureLead[feature]} öffnen – das gehört zu Pro.`
          : undefined
      }
      size="xl"
    >
      <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-white">Pro umfasst:</p>
          <ul className="space-y-1.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                <span aria-hidden className="mt-0.5 text-emerald-400">
                  ✓
                </span>
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
              onClick={() => setCheckoutNote(true)}
              className={[
                'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition',
                plan.recommended
                  ? 'border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                  : 'border-slate-700 bg-slate-900/60 hover:bg-slate-800',
              ].join(' ')}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {plan.name}
              </span>
              <span className="text-lg font-bold text-white">
                {plan.price}{' '}
                <span className="text-xs font-normal text-slate-400">{plan.per}</span>
              </span>
              <span className="text-[11px] text-slate-500">{plan.note}</span>
              {plan.recommended && (
                <span className="mt-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  Empfohlen
                </span>
              )}
            </button>
          ))}
        </div>

        {checkoutNote && (
          <p className="rounded-lg border border-amber-500/40 bg-amber-950/50 px-3 py-2 text-xs text-amber-200">
            Die Bezahlung wird in Kürze aktiviert. Danke für dein Interesse –
            du kannst Pro dann hier freischalten.
          </p>
        )}

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
    </Modal>
  )
}
