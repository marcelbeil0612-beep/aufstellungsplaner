import { describe, expect, it } from 'vitest'
import {
  LICENSE_GRACE_DAYS,
  licenseNeedsRefresh,
  licenseRefreshDue,
  licenseUsable,
  type LicenseClaims,
} from './license'

const DAY = 86400
const now = 1_700_000_000_000 // fester Bezugszeitpunkt (ms)
const nowS = Math.floor(now / 1000)

function claims(p: Partial<LicenseClaims>): LicenseClaims {
  return {
    v: 1,
    email: 'a@b.de',
    plan: 'lifetime',
    iat: nowS - 30 * DAY,
    exp: nowS + 30 * DAY,
    ...p,
  }
}

describe('licenseUsable – Karenz gilt für ALLE Pläne (auch Lifetime)', () => {
  it('vor exp nutzbar', () => {
    expect(licenseUsable(claims({ exp: nowS + DAY }), now)).toBe(true)
  })

  it('nach exp, aber innerhalb der 90-Tage-Karenz nutzbar', () => {
    const exp = nowS - 10 * DAY
    expect(licenseUsable(claims({ plan: 'lifetime', exp }), now)).toBe(true)
    expect(licenseUsable(claims({ plan: 'year', exp, sub: 's' }), now)).toBe(true)
  })

  it('nach exp + Karenz NICHT mehr nutzbar – auch Lifetime nicht', () => {
    const exp = nowS - (LICENSE_GRACE_DAYS + 1) * DAY
    expect(licenseUsable(claims({ plan: 'lifetime', exp }), now)).toBe(false)
    expect(licenseUsable(claims({ plan: 'month', exp, sub: 's' }), now)).toBe(false)
  })
})

describe('licenseNeedsRefresh – ab exp für jeden Plan', () => {
  it('vor exp kein Refresh nötig', () => {
    expect(licenseNeedsRefresh(claims({ exp: nowS + DAY }), now)).toBe(false)
  })

  it('ab exp Refresh nötig – auch Lifetime', () => {
    expect(licenseNeedsRefresh(claims({ plan: 'lifetime', exp: nowS - 1 }), now)).toBe(true)
    expect(licenseNeedsRefresh(claims({ plan: 'year', exp: nowS - 1, sub: 's' }), now)).toBe(true)
  })
})

describe('licenseRefreshDue – ab Token-Halbzeit, TTL-agnostisch', () => {
  it('vor der Halbzeit noch nicht fällig', () => {
    const c = claims({ iat: nowS - 5 * DAY, exp: nowS + 25 * DAY }) // 30d TTL, 5d alt
    expect(licenseRefreshDue(c, now)).toBe(false)
  })

  it('nach der Halbzeit fällig (proaktiver Hintergrund-Refresh)', () => {
    const c = claims({ iat: nowS - 20 * DAY, exp: nowS + 10 * DAY }) // 30d TTL, 20d alt
    expect(licenseRefreshDue(c, now)).toBe(true)
  })

  it('funktioniert auch für lange Laufzeiten (365-Tage-Abo)', () => {
    const early = claims({ iat: nowS - 10 * DAY, exp: nowS + 355 * DAY })
    const late = claims({ iat: nowS - 300 * DAY, exp: nowS + 65 * DAY })
    expect(licenseRefreshDue(early, now)).toBe(false)
    expect(licenseRefreshDue(late, now)).toBe(true)
  })

  it('degeneriertes Token (exp <= iat) ist sofort fällig', () => {
    expect(licenseRefreshDue(claims({ iat: nowS, exp: nowS }), now)).toBe(true)
  })
})
