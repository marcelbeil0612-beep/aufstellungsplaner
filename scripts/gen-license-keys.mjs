// Erzeugt ein ECDSA-P-256-Schlüsselpaar für die Lizenz-Signatur.
// Aufruf:  node scripts/gen-license-keys.mjs
//
// Ausgabe: zwei Env-Werte. PRIVATE → Vercel-Server-Env + lokale .env.
//          PUBLIC  → Vercel-Client-Env (VITE_) + lokale .env.
// Niemals den Private Key committen.
import { generateKeyPairSync } from 'node:crypto'

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' })

const priv = privateKey.export({ type: 'pkcs8', format: 'der' }).toString('base64')
const pub = publicKey.export({ type: 'spki', format: 'der' }).toString('base64')

console.log('\n# In Vercel (Server, geheim) und lokale .env:')
console.log(`LICENSE_PRIVATE_KEY=${priv}`)
console.log('\n# In Vercel (Client, VITE_) und lokale .env:')
console.log(`VITE_LICENSE_PUBLIC_KEY=${pub}\n`)
