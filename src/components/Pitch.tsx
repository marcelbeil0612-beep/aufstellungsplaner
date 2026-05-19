import { useEffect, useMemo, useRef, useState } from 'react'
import { PRESSING_ZONE_DEPTH, effectiveShape, pressingLineY, shapeSlots } from '../lib/phaseShift'
import { useLineupStore } from '../store/useLineupStore'
import type { Formation } from '../types'
import { SlotDropZone } from './SlotDropZone'

type Props = { formation: Formation }

/**
 * Modernes Spielfeld in vertikaler Ausrichtung (eigenes Tor unten, gegnerisches oben).
 * Linien und Rasen sind in SVG gerendert, Slots werden darüber positioniert.
 */
export function Pitch({ formation }: Props) {
  const phase = useLineupStore((s) => s.phase)
  const shape = useLineupStore((s) => s.phaseShape[phase])
  const slots = useMemo(
    () => shapeSlots(formation.slots, effectiveShape(phase, shape)),
    [formation.slots, phase, shape],
  )

  // Slot-Positionen werden ausschließlich beim Phasenwechsel animiert, nicht
  // während des normalen Drag-and-Drops. So gibt es kein „Nachlaufen" wenn
  // ein Chip in einen Slot einrastet.
  const [animatingPhase, setAnimatingPhase] = useState(false)
  const lastPhase = useRef(phase)
  useEffect(() => {
    if (lastPhase.current === phase) return
    lastPhase.current = phase
    setAnimatingPhase(true)
    const t = window.setTimeout(() => setAnimatingPhase(false), 550)
    return () => window.clearTimeout(t)
  }, [phase])

  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[480px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
      <svg
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="pitch-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#25823d" />
            <stop offset="100%" stopColor="#1a5d2c" />
          </linearGradient>
          <pattern id="pitch-stripes" width="100" height="12.5" patternUnits="userSpaceOnUse">
            <rect width="100" height="6.25" fill="rgba(255,255,255,0.06)" />
          </pattern>
          <filter id="pitch-noise" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="pitch-vignette" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
          <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.25" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100" height="150" fill="url(#pitch-grass)" />
        <rect width="100" height="150" fill="url(#pitch-stripes)" />
        <rect width="100" height="150" filter="url(#pitch-noise)" opacity="0.6" />
        <rect width="100" height="150" fill="url(#pitch-vignette)" />

        <g
          fill="none"
          stroke="#f8fafc"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#line-glow)"
        >
          <rect x="2" y="2" width="96" height="146" rx="0.6" />
          <line x1="2" y1="75" x2="98" y2="75" />
          <circle cx="50" cy="75" r="9" />
          <circle cx="50" cy="75" r="0.7" fill="#f8fafc" stroke="none" />
          <rect x="22" y="2" width="56" height="18" />
          <rect x="36" y="2" width="28" height="6" />
          <circle cx="50" cy="14" r="0.7" fill="#f8fafc" stroke="none" />
          <path d="M 41 20 A 9 9 0 0 0 59 20" />
          <line x1="44" y1="2" x2="56" y2="2" strokeWidth="1" />
          <rect x="22" y="130" width="56" height="18" />
          <rect x="36" y="142" width="28" height="6" />
          <circle cx="50" cy="136" r="0.7" fill="#f8fafc" stroke="none" />
          <path d="M 41 130 A 9 9 0 0 1 59 130" />
          <line x1="44" y1="148" x2="56" y2="148" strokeWidth="1" />
          <path d="M 2 4 A 2 2 0 0 0 4 2" />
          <path d="M 98 4 A 2 2 0 0 1 96 2" />
          <path d="M 2 146 A 2 2 0 0 1 4 148" />
          <path d="M 98 146 A 2 2 0 0 0 96 148" />
        </g>
      </svg>

      <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
        Gegner ↑
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
        Eigenes Tor ↓
      </div>

      {phase === 'withoutBall' &&
        (() => {
          const lineY = pressingLineY(slots)
          const bandTop = 100 - lineY
          const bandHeight = Math.min(PRESSING_ZONE_DEPTH, 92 - bandTop)
          return (
            <div className="pointer-events-none absolute inset-0">
              {bandHeight > 0 && (
                <div
                  className="absolute inset-x-0 bg-amber-400/12"
                  style={{ top: `${bandTop}%`, height: `${bandHeight}%` }}
                />
              )}
              <div
                className="absolute inset-x-0 border-t-2 border-dashed border-amber-300/70"
                style={{ top: `${bandTop}%` }}
              />
              <div
                className="absolute left-2 -translate-y-1/2 rounded bg-amber-500/85 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-950"
                style={{ top: `${bandTop}%` }}
              >
                1. Störer
              </div>
            </div>
          )
        })()}

      <div className="absolute inset-0">
        {slots.map((slot) => (
          <SlotDropZone key={slot.id} slot={slot} animating={animatingPhase} />
        ))}
      </div>
    </div>
  )
}
