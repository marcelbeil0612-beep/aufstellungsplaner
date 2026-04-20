import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const svg = readFileSync('public/pwa-icon-source.svg')

const targets = [
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  // Maskable: gleiches Bild, OS legt eigenen Mask-Shape (rund, squircle, …) drüber.
  // Unser Motiv liegt sicher im inneren 80%-Safe-Zone-Bereich.
  { size: 512, name: 'maskable-icon-512x512.png' },
  // Apple Touch Icon: iOS rendert das ohne weitere Maske, Größe = 180x180.
  { size: 180, name: 'apple-touch-icon.png' },
]

for (const { size, name } of targets) {
  const out = join('public', name)
  await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(out)
  console.log(`✓ ${name}`)
}
