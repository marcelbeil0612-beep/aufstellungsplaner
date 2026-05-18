import { create } from 'zustand'
import type { ProFeature } from '../lib/proAccess'

/**
 * Ephemerer UI-Zustand der Paywall: welches gesperrte Feature der Nutzer
 * zuletzt angetippt hat. Bewusst ein eigener, NICHT persistierter Store
 * (kein `partialize`/IndexedDB) – ein offener Dialog darf einen Reload
 * nicht überleben.
 */
type PaywallState = {
  /** Aktuell angefragtes Pro-Feature, oder null, wenn kein Dialog offen ist. */
  feature: ProFeature | null
  /** Öffnet die Paywall für das genannte Feature. */
  requestUnlock: (feature: ProFeature) => void
  /** Schließt die Paywall. */
  dismiss: () => void
}

export const usePaywallStore = create<PaywallState>((set) => ({
  feature: null,
  requestUnlock: (feature) => set({ feature }),
  dismiss: () => set({ feature: null }),
}))
