import type { Formation } from '../types'
import { SlotDropZone } from './SlotDropZone'

type Props = { formation: Formation }

/**
 * Modernes Spielfeld in vertikaler Ausrichtung (eigenes Tor unten, gegnerisches oben).
 * Die Linien sind als SVG eingelegt, die Slots werden absolut darüber positioniert,
 * damit @dnd-kit normale DOM-Drop-Targets nutzen kann.
 */
export function Pitch({ formation }: Props) {
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[640px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
      {/* Rasen */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, #1f6b3a 0 8.33%, #2a8a4a 8.33% 16.66%)',
          }}
        />
        {/* sanftes Vignette-Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      {/* Linien */}
      <svg
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g fill="none" stroke="#f8fafc" strokeWidth="0.4" opacity="0.85">
          {/* Außenlinie */}
          <rect x="2" y="2" width="96" height="146" rx="0.5" />
          {/* Mittellinie */}
          <line x1="2" y1="75" x2="98" y2="75" />
          {/* Mittelkreis + Anstoßpunkt */}
          <circle cx="50" cy="75" r="9" />
          <circle cx="50" cy="75" r="0.6" fill="#f8fafc" />
          {/* Strafraum oben */}
          <rect x="22" y="2" width="56" height="18" />
          <rect x="36" y="2" width="28" height="6" />
          <circle cx="50" cy="14" r="0.6" fill="#f8fafc" />
          <path d="M 41 20 A 9 9 0 0 0 59 20" />
          {/* Strafraum unten */}
          <rect x="22" y="130" width="56" height="18" />
          <rect x="36" y="142" width="28" height="6" />
          <circle cx="50" cy="136" r="0.6" fill="#f8fafc" />
          <path d="M 41 130 A 9 9 0 0 1 59 130" />
          {/* Eckviertel */}
          <path d="M 2 4 A 2 2 0 0 0 4 2" />
          <path d="M 98 4 A 2 2 0 0 1 96 2" />
          <path d="M 2 146 A 2 2 0 0 1 4 148" />
          <path d="M 98 146 A 2 2 0 0 0 96 148" />
        </g>
      </svg>

      {/* Slots */}
      <div className="absolute inset-0">
        {formation.slots.map((slot) => (
          <SlotDropZone key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  )
}
