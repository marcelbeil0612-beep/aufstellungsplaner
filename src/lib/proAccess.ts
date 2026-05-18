import { useLineupStore } from '../store/useLineupStore'
import { usePaywallStore } from '../store/paywallStore'

/**
 * Gate-Schlüssel für alle Pro-pflichtigen Funktionen (Quelle: Markt-Synthese,
 * Abschnitt „Pro-System"). Jeder Schlüssel ist eine Stelle, an der die App
 * zwischen Free und Pro unterscheidet. Free-Pendants (Mit-Ball-Phase,
 * PNG-Export, Read-only-Share-Ansicht) werden bewusst gar nicht gegatet.
 */
export type ProFeature =
  | 'systembuch-full' // alle 81 Duelle (außer den 3 Schaufenster-Duellen)
  | 'phase-without-ball' // Phasen-Umschalter „Gegen Ball"
  | 'auto-lineup' // Hungarian-Auto-Aufstellung
  | 'substitutions' // Wechselplan
  | 'multi-team' // mehrere Mannschaften
  | 'share-import' // Import einer geteilten Aufstellung
  | 'backup-import' // Backup-Datei einspielen

/**
 * Features, die Pro verlangen. Ein hier nicht gelisteter `ProFeature` gilt als
 * frei – so lässt sich eine einzelne Funktion temporär ohne Pro öffnen
 * (z. B. Promo), ohne Call-Sites anzufassen.
 */
const PRO_GATED: ReadonlySet<ProFeature> = new Set<ProFeature>([
  'systembuch-full',
  'phase-without-ball',
  'auto-lineup',
  'substitutions',
  'multi-team',
  'share-import',
  'backup-import',
])

/** Reine Logik (kein React): Verlangt dieses Feature grundsätzlich Pro? */
export const isProFeature = (feature: ProFeature): boolean => PRO_GATED.has(feature)

/**
 * Drei frei zugängliche Schaufenster-Duelle aus dem Systembuch (Quelle:
 * Synthese – „Keine harte Paywall vor dem Aha-Moment"). Gerichtet als
 * [unser System, Gegner-System]. Alle anderen der 81 Duelle sind Pro.
 * Strings statt SystemId, damit `proAccess` von den Taktik-Daten entkoppelt
 * bleibt – die SystemId-Werte sind zuweisungskompatibel.
 */
export const SHOWCASE_DUELS: ReadonlyArray<readonly [string, string]> = [
  ['4-3-3', '4-4-2'],
  ['4-2-3-1', '5-3-2'],
  ['3-5-2', '4-3-3'],
]

/** Ist dieses (gerichtete) Duell ohne Pro sichtbar? */
export const isShowcaseDuel = (our: string, opp: string): boolean =>
  SHOWCASE_DUELS.some(([o, p]) => o === our && p === opp)

/** Hook: aktueller Pro-Freischalt-Status des Geräts. */
export const useProStatus = (): boolean => useLineupStore((s) => s.isPro)

/**
 * Hook: Darf der Nutzer dieses Feature aktuell verwenden? `true`, wenn das
 * Feature frei ist oder Pro freigeschaltet wurde.
 */
export const useFeatureAccess = (feature: ProFeature): boolean => {
  const isPro = useProStatus()
  return isPro || !isProFeature(feature)
}

/**
 * Hook für klick-gegatete Aktionen: liefert `allowed` und `guard(action)`.
 * `guard` führt `action` aus, wenn das Feature frei/freigeschaltet ist –
 * sonst öffnet es die Paywall für genau dieses Feature.
 */
export const useProGuard = (
  feature: ProFeature,
): { allowed: boolean; guard: (action: () => void) => void } => {
  const allowed = useFeatureAccess(feature)
  const requestUnlock = usePaywallStore((s) => s.requestUnlock)
  return {
    allowed,
    guard: (action: () => void) => {
      if (allowed) action()
      else requestUnlock(feature)
    },
  }
}
