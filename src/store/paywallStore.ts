import { create } from 'zustand'
import type { ProFeature } from '../lib/proAccess'

/**
 * Ephemerer UI-Zustand der Paywall: welches gesperrte Feature der Nutzer
 * zuletzt angetippt hat — oder „Pro-Lizenz anzeigen" als eigener Modus
 * für bereits zahlende Nutzer (Schlüssel kopieren, weiteres Gerät
 * freischalten). Bewusst ein eigener, NICHT persistierter Store
 * (kein `partialize`/IndexedDB) – ein offener Dialog darf einen Reload
 * nicht überleben.
 */
type PaywallState = {
  /** Aktuell angefragtes Pro-Feature, oder null, wenn nicht über Feature-Klick geöffnet. */
  feature: ProFeature | null
  /** Eigener Modus: Pro-Lizenz anzeigen (Kopie für weitere Geräte). */
  showLicense: boolean
  /** Öffnet die Paywall für das genannte Feature (Upgrade-Pfad). */
  requestUnlock: (feature: ProFeature) => void
  /** Öffnet die Paywall im „Pro-Lizenz"-Modus (zeigt den Lizenzschlüssel). */
  showLicenseInfo: () => void
  /** Schließt die Paywall (jeden Modus). */
  dismiss: () => void
}

export const usePaywallStore = create<PaywallState>((set) => ({
  feature: null,
  showLicense: false,
  requestUnlock: (feature) => set({ feature }),
  showLicenseInfo: () => set({ showLicense: true }),
  dismiss: () => set({ feature: null, showLicense: false }),
}))
