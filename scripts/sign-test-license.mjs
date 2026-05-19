// Dev-Hilfe: erzeugt ein Schlüsselpaar (falls keins via Env gesetzt)
// und signiert einen Test-Lizenz-Token – um den Client-Verify-/
// Freischalt-Pfad OHNE Paddle zu testen.
//
//   node scripts/sign-test-license.mjs [plan] [email] [daysValid]
//   plan: lifetime | year | month   (default: lifetime)
import { generateKeyPairSync } from 'node:crypto'
import { signLicense, rollingExp } from '../server/licenseSign.mjs'

const [, , planArg = 'lifetime', emailArg = 'test@formaxi.de', daysArg] = process.argv
const plan = ['lifetime', 'year', 'month'].includes(planArg) ? planArg : 'lifetime'

let priv = process.env.LICENSE_PRIVATE_KEY
let pub = process.env.VITE_LICENSE_PUBLIC_KEY
if (!priv || !pub) {
  const kp = generateKeyPairSync('ec', { namedCurve: 'P-256' })
  priv = kp.privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64')
  pub = kp.publicKey.export({ type: 'spki', format: 'der' }).toString('base64')
}

const iat = Math.floor(Date.now() / 1000)
const exp =
  Number(daysArg) > 0
    ? iat + Number(daysArg) * 86400
    : plan === 'lifetime'
      ? rollingExp()
      : iat + 365 * 86400

const token = signLicense(
  {
    v: 1,
    email: emailArg,
    plan,
    exp,
    iat,
    txn: 'txn_test',
    ...(plan !== 'lifetime' ? { sub: 'sub_test' } : {}),
  },
  priv,
)

console.log('\nVITE_LICENSE_PUBLIC_KEY=' + pub)
console.log('\nLICENSE_PRIVATE_KEY=' + priv)
console.log('\nTEST-TOKEN (' + plan + ', ' + emailArg + '):\n' + token + '\n')
