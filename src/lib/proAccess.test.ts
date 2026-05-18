import { describe, expect, it } from 'vitest'
import { migratePersistedState } from '../store/useLineupStore'
import { isProFeature, isShowcaseDuel, SHOWCASE_DUELS, type ProFeature } from './proAccess'

describe('isProFeature', () => {
  const gated: ProFeature[] = [
    'systembuch-full',
    'phase-without-ball',
    'auto-lineup',
    'substitutions',
    'multi-team',
    'share-import',
    'backup-import',
  ]

  it('alle Synthese-Pro-Features sind Pro-pflichtig', () => {
    for (const f of gated) expect(isProFeature(f)).toBe(true)
  })
})

describe('isShowcaseDuel', () => {
  it('die drei Synthese-Schaufenster-Duelle sind frei', () => {
    expect(isShowcaseDuel('4-3-3', '4-4-2')).toBe(true)
    expect(isShowcaseDuel('4-2-3-1', '5-3-2')).toBe(true)
    expect(isShowcaseDuel('3-5-2', '4-3-3')).toBe(true)
    expect(SHOWCASE_DUELS).toHaveLength(3)
  })

  it('ist gerichtet – der Spiegel eines Schaufenster-Duells ist nicht frei', () => {
    expect(isShowcaseDuel('4-4-2', '4-3-3')).toBe(false)
    expect(isShowcaseDuel('5-3-2', '4-2-3-1')).toBe(false)
  })

  it('beliebige andere Duelle sind gesperrt', () => {
    expect(isShowcaseDuel('4-4-2', '3-5-2')).toBe(false)
    expect(isShowcaseDuel('5-4-1', '4-1-4-1')).toBe(false)
  })
})

describe('migratePersistedState · v8 → v9 (isPro)', () => {
  it('setzt isPro=false für Altinstallationen ohne das Feld', () => {
    const out = migratePersistedState({ matches: [] }, 8)
    expect(out.isPro).toBe(false)
  })

  it('lässt eine bereits gesetzte Pro-Freischaltung unangetastet', () => {
    const out = migratePersistedState({ isPro: true }, 8)
    expect(out.isPro).toBe(true)
  })

  it('repariert einen kaputten isPro-Typ zu false', () => {
    const out = migratePersistedState({ isPro: 'yes' as unknown as boolean }, 8)
    expect(out.isPro).toBe(false)
  })

  it('überschreibt andere Felder bei der v9-Migration nicht', () => {
    const out = migratePersistedState({ formationId: '4-3-3', isPro: true }, 8)
    expect(out.formationId).toBe('4-3-3')
    expect(out.isPro).toBe(true)
  })
})
