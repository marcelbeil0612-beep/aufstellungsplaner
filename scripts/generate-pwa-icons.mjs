import sharp from 'sharp'
import { join } from 'node:path'

// Markenquellen (FormaXI), randloses Grün, jeweils außerhalb von public/,
// damit sie nicht ins Deploy wandern:
// - icon-source:    volles X-I-Motiv, Motiv in der Maskable-Safe-Zone.
// - favicon-source: stark vereinfachtes, fettes XI für Mini-Größen.
const ICON_SOURCE = 'assets/icon-source.png'
const FAVICON_SOURCE = 'assets/favicon-source.png'

const targets = [
  { size: 192, name: 'pwa-192x192.png', src: ICON_SOURCE },
  { size: 512, name: 'pwa-512x512.png', src: ICON_SOURCE },
  // Maskable: gleiches Bild, OS legt eigenen Mask-Shape (rund, squircle, …)
  // drüber. Motiv liegt im inneren 80%-Safe-Zone-Bereich.
  { size: 512, name: 'maskable-icon-512x512.png', src: ICON_SOURCE },
  // Apple Touch Icon: iOS rendert das ohne weitere Maske, 180x180.
  { size: 180, name: 'apple-touch-icon.png', src: ICON_SOURCE },
  // Browser-Tab-Favicon: bewusst die fette Sondervariante, damit es
  // bei 16/32 px noch eindeutig lesbar ist.
  { size: 48, name: 'favicon.png', src: FAVICON_SOURCE },
  { size: 32, name: 'favicon-32.png', src: FAVICON_SOURCE },
]

for (const { size, name, src } of targets) {
  const out = join('public', name)
  await sharp(src)
    .resize(size, size, { fit: 'cover', kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(out)
  console.log(`✓ ${name}  ←  ${src}`)
}
