import sharp from 'sharp'
import { join } from 'node:path'

// Marken-Quellbild (FormaXI): randloses grünes Quadrat mit dem weißen
// X-I-Motiv, Motiv sicher in der inneren 80%-Maskable-Safe-Zone.
// Liegt bewusst außerhalb von public/, damit es nicht ins Deploy wandert.
const source = 'assets/icon-source.png'

const targets = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  // Maskable: gleiches Bild, OS legt eigenen Mask-Shape (rund, squircle, …)
  // drüber. Motiv liegt im inneren 80%-Safe-Zone-Bereich.
  { size: 512, name: 'maskable-icon-512x512.png' },
  // Apple Touch Icon: iOS rendert das ohne weitere Maske, 180x180.
  { size: 180, name: 'apple-touch-icon.png' },
  // Browser-Tab-Favicon (PNG, kein SVG – vorhersehbarer bei Mini-Größen).
  { size: 48, name: 'favicon.png' },
  { size: 32, name: 'favicon-32.png' },
]

for (const { size, name } of targets) {
  const out = join('public', name)
  await sharp(source)
    .resize(size, size, { fit: 'cover', kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toFile(out)
  console.log(`✓ ${name}`)
}
