// SVG-Spielfeld-Helper für das Lead-Magnet-PDF.
// Speist sich aus formations.ts (Single Source of Truth der App).
//
// Koordinaten-System der App:
//   x: 0 = links, 100 = rechts
//   y: 0 = eigene Torlinie, 100 = gegnerische Torlinie
//
// Darstellung im PDF (viewBox 0 0 100 150, vertikal):
//   Wir (Formation A) greifen nach OBEN an  → eigenes Tor unten.
//   svgY_A = 150 - y * 1.5
//   Gegner (Formation B) wird an der y-Achse gespiegelt (ihr Tor oben):
//   svgY_B = y * 1.5
import { formationById } from '../../src/data/formations'

const W = 100
const H = 150

/** Statische Spielfeld-Linien (entspricht der Geometrie aus components/Pitch.tsx). */
function pitchLines(stroke: string, strokeWidth = 0.5, glow = true): string {
  return `
    <g fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"
       stroke-linecap="round" stroke-linejoin="round"${glow ? ' filter="url(#lm-line-glow)"' : ''}>
      <rect x="2" y="2" width="96" height="146" rx="0.8" />
      <line x1="2" y1="75" x2="98" y2="75" />
      <circle cx="50" cy="75" r="9" />
      <circle cx="50" cy="75" r="0.7" fill="${stroke}" stroke="none" />
      <rect x="22" y="2" width="56" height="18" />
      <rect x="36" y="2" width="28" height="6" />
      <circle cx="50" cy="14" r="0.7" fill="${stroke}" stroke="none" />
      <path d="M 41 20 A 9 9 0 0 0 59 20" />
      <rect x="22" y="130" width="56" height="18" />
      <rect x="36" y="142" width="28" height="6" />
      <circle cx="50" cy="136" r="0.7" fill="${stroke}" stroke="none" />
      <path d="M 41 130 A 9 9 0 0 1 59 130" />
      <path d="M 2 4 A 2 2 0 0 0 4 2" />
      <path d="M 98 4 A 2 2 0 0 1 96 2" />
      <path d="M 2 146 A 2 2 0 0 1 4 148" />
      <path d="M 98 146 A 2 2 0 0 0 96 148" />
    </g>`
}

/**
 * Rendert ein kompaktes Spielfeld-SVG mit Formation A (voll) und
 * Formation B (gestrichelte Schatten-Slots, an der y-Achse gespiegelt).
 */
export function renderPitchSVG(ourSystemId: string, opponentSystemId: string): string {
  const a = formationById(ourSystemId)
  const b = formationById(opponentSystemId)

  // Gegner zuerst (liegt optisch hinter unseren Spielern)
  const shadow = b.slots
    .map((s) => {
      const cx = s.x
      const cy = s.y * 1.5 // gespiegelte y-Achse → ihr Tor oben
      return `<circle cx="${cx}" cy="${cy.toFixed(1)}" r="3" fill="none"
        stroke="rgba(255,255,255,0.5)" stroke-width="0.5" stroke-dasharray="1.6 1.2" />`
    })
    .join('')

  const ours = a.slots
    .map((s) => {
      const cx = s.x
      const cy = 150 - s.y * 1.5 // eigenes Tor unten
      return `
        <circle cx="${cx}" cy="${cy.toFixed(1)}" r="3.7"
          fill="#22c55e" stroke="#052e16" stroke-width="0.6" />
        <text x="${cx}" y="${(cy + 1.05).toFixed(1)}" text-anchor="middle"
          font-size="2.55" font-weight="700"
          font-family="Inter, system-ui, sans-serif" fill="#04210f">${s.position}</text>`
    })
    .join('')

  return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"
     xmlns="http://www.w3.org/2000/svg" class="lm-pitch">
  <defs>
    <linearGradient id="lm-grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e7a3e" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>
    <filter id="lm-line-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.18" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" rx="3" fill="url(#lm-grass)" />
  ${[0, 2, 4, 6, 8, 10]
    .map((i) =>
      i % 2 === 0
        ? `<rect x="0" y="${i * 12.5}" width="${W}" height="12.5" fill="rgba(255,255,255,0.04)" />`
        : '',
    )
    .join('')}
  ${pitchLines('#f8fafc', 0.5, true)}
  ${shadow}
  ${ours}
</svg>`
}

/** Dezentes Linien-Backdrop (nur Linien, kein Rasen) für Cover/Story-Seiten. */
export function pitchBackdrop(): string {
  return `
<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"
     xmlns="http://www.w3.org/2000/svg" class="lm-backdrop" aria-hidden="true">
  ${pitchLines('#34d399', 0.4, false)}
</svg>`
}
