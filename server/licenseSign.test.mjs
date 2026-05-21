// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import {
  signLicense,
  verifyLicenseServer,
  rollingExp,
  LIFETIME_EXP,
  LICENSE_TTL_DAYS,
  b64url,
} from './licenseSign.mjs'

const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
const PRIV = privateKey.export({ format: 'der', type: 'pkcs8' }).toString('base64')

const nowS = () => Math.floor(Date.now() / 1000)

const base = () => ({
  v: 1,
  email: 'test@example.com',
  plan: 'lifetime',
  exp: nowS() + 86400,
  iat: nowS(),
})

describe('signLicense / verifyLicenseServer – Roundtrip', () => {
  it('signierter Token verifiziert erfolgreich', () => {
    const token = signLicense(base(), PRIV)
    expect(typeof token).toBe('string')
    expect(token).toContain('.')
    const claims = verifyLicenseServer(token, PRIV)
    expect(claims).not.toBeNull()
    expect(claims.email).toBe('test@example.com')
    expect(claims.plan).toBe('lifetime')
    expect(claims.v).toBe(1)
  })

  it('alle drei Pläne werden korrekt signiert und verifiziert', () => {
    for (const plan of ['year', 'month', 'lifetime']) {
      const c = { ...base(), plan, ...(plan !== 'lifetime' ? { sub: 'sub_1' } : {}) }
      const token = signLicense(c, PRIV)
      const claims = verifyLicenseServer(token, PRIV)
      expect(claims.plan).toBe(plan)
    }
  })

  it('optionale Felder sub und txn werden mitsigniert', () => {
    const token = signLicense({ ...base(), plan: 'year', sub: 'sub_abc', txn: 'txn_xyz' }, PRIV)
    const claims = verifyLicenseServer(token, PRIV)
    expect(claims.sub).toBe('sub_abc')
    expect(claims.txn).toBe('txn_xyz')
  })
})

describe('signLicense / verifyLicenseServer – Fälschungsresistenz', () => {
  it('manipulierter Payload → null (Signatur passt nicht mehr)', () => {
    const token = signLicense(base(), PRIV)
    const [, sig] = token.split('.')
    const evil = b64url(JSON.stringify({ ...base(), email: 'evil@x.de' }))
    expect(verifyLicenseServer(`${evil}.${sig}`, PRIV)).toBeNull()
  })

  it('manipulierte Signatur → null', () => {
    const token = signLicense(base(), PRIV)
    const [payload] = token.split('.')
    // 64 zero-bytes als ungültige IEEE-P1363-Signatur (86 base64url-Chars)
    const zeroSig = 'A'.repeat(86)
    expect(verifyLicenseServer(`${payload}.${zeroSig}`, PRIV)).toBeNull()
  })

  it('komplett ungültige Token-Formate → null', () => {
    expect(verifyLicenseServer('', PRIV)).toBeNull()
    expect(verifyLicenseServer('nodot', PRIV)).toBeNull()
    expect(verifyLicenseServer('.', PRIV)).toBeNull()
  })

  it('Token mit anderem Private Key ausgestellt → null', () => {
    const { privateKey: other } = generateKeyPairSync('ec', { namedCurve: 'P-256' })
    const otherPriv = other.export({ format: 'der', type: 'pkcs8' }).toString('base64')
    const token = signLicense(base(), otherPriv)
    expect(verifyLicenseServer(token, PRIV)).toBeNull()
  })
})

describe('Hilfsfunktionen', () => {
  it('rollingExp liegt genau LICENSE_TTL_DAYS × 86400 s in der Zukunft (±2 s)', () => {
    const before = nowS()
    const exp = rollingExp()
    const after = nowS()
    expect(exp).toBeGreaterThanOrEqual(before + LICENSE_TTL_DAYS * 86400)
    expect(exp).toBeLessThanOrEqual(after + LICENSE_TTL_DAYS * 86400)
  })

  it('LIFETIME_EXP liegt ~100 Jahre in der Zukunft', () => {
    const now = nowS()
    const exp = LIFETIME_EXP()
    expect(exp).toBeGreaterThan(now + 99 * 365 * 86400)
    expect(exp).toBeLessThan(now + 101 * 365 * 86400)
  })

  it('LICENSE_TTL_DAYS = 30 (Lizenz-Refund-Durchsetzung innerhalb eines Monats)', () => {
    expect(LICENSE_TTL_DAYS).toBe(30)
  })

  it('b64url kodiert ohne Padding und ohne + oder /', () => {
    const result = b64url(Buffer.from('Hello World'))
    expect(result).not.toContain('+')
    expect(result).not.toContain('/')
    expect(result).not.toContain('=')
    expect(result).toBe('SGVsbG8gV29ybGQ')
  })
})
