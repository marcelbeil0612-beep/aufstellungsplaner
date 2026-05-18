import type { ReactNode } from 'react'
import type { ProFeature } from '../lib/proAccess'
import { useFeatureAccess } from '../lib/proAccess'

type Props = {
  feature: ProFeature
  children: ReactNode
  /**
   * Wird gerendert, wenn das Feature gesperrt ist. Bleibt bewusst offen:
   * die eigentliche Paywall-UI (Dialog/Sperr-Overlay) liefert P3 hier hinein.
   * Ohne `fallback` rendert das Gate nichts.
   */
  fallback?: ReactNode
}

/**
 * Schützt Pro-Inhalte deklarativ: rendert `children` nur, wenn das Feature
 * frei oder Pro freigeschaltet ist, sonst `fallback`. Reine Architektur-
 * Komponente – sie kennt die Paywall nicht, sondern nur die Zugriffslogik.
 */
export function FeatureGate({ feature, children, fallback = null }: Props) {
  const allowed = useFeatureAccess(feature)
  return <>{allowed ? children : fallback}</>
}
