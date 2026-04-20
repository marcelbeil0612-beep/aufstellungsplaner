/**
 * Liest eine Bilddatei, beschneidet sie zentriert quadratisch, skaliert auf `size`
 * und gibt ein komprimiertes JPEG als Data-URL zurück. So bleibt der
 * localStorage-Fußabdruck klein (ein 256-JPEG ist ≈ 20-40 kB).
 */
export async function fileToSquareDataUrl(
  file: File,
  size = 256,
  quality = 0.85,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Bitte eine Bilddatei auswählen.')
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'))
      i.src = url
    })
    const min = Math.min(img.width, img.height)
    const sx = (img.width - min) / 2
    const sy = (img.height - min) / 2
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas-Kontext nicht verfügbar.')
    ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
    return canvas.toDataURL('image/jpeg', quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Erzeugt aus einem Namen zwei Initialbuchstaben für den Avatar-Fallback. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
