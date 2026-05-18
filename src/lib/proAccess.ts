import { useLineupStore } from '../store/useLineupStore'

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
