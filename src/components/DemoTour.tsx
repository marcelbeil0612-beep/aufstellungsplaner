import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

/**
 * Geführte Tour für den Demo-Modus: Sprechblasen mit Spotlight auf die
 * Kernfunktionen. Nicht-blockierend (die App bleibt nutzbar), jederzeit
 * überspringbar und über einen kleinen Button erneut startbar.
 */

type Step = {
  /** `data-tour`-Wert des Zielelements; fehlt = zentrierte Abschlusskarte. */
  target?: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    target: 'pitch',
    title: 'Aufstellung bauen',
    body: 'Spieler per Drag-and-Drop aufs Feld ziehen. Die Farbe am Spieler zeigt sofort, wie gut er auf diese Position passt.',
  },
  {
    target: 'phase',
    title: 'Taktische Phasen',
    body: '„Mit Ball" positioniert offensiv, „Gegen den Ball" defensiv – die Mannschaft verschiebt sich realistisch, je Phase getrennt.',
  },
  {
    target: 'shape',
    title: 'Form & Pressing',
    body: 'Breite und Höhe stufenlos regeln. Defensiv zusätzlich Pressinghöhe per Klick: tiefer Block, Mittelfeld- oder hohes Pressing.',
  },
  {
    target: 'auto',
    title: 'Beste Aufstellung',
    body: 'Ein Klick – das Tool rechnet die stärkste Elf nach Skill-Score und stellt sie automatisch auf.',
  },
  {
    target: 'systembuch',
    title: 'Systembuch',
    body: '81 Duelle System gegen System, jeweils in vier Spielphasen mit konkretem Live-Coaching für den Spieltag.',
  },
  {
    title: 'Das war die Tour',
    body: 'Im echten Tool ist all das in unter 3 Minuten erledigt – ohne Anmeldung, ohne Cloud, lokal auf deinem Gerät.',
  },
]

type Rect = { top: number; left: number; width: number; height: number }

function findRect(target?: string): Rect | null {
  if (!target || typeof document === 'undefined') return null
  const el = document.querySelector(`[data-tour="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export function DemoTour() {
  const [active, setActive] = useState(true)
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)

  // Index defensiv klemmen – nie aus dem STEPS-Array herauslaufen.
  const clamped = Math.min(Math.max(index, 0), STEPS.length - 1)
  const step = STEPS[clamped]
  const isLast = clamped === STEPS.length - 1
  const goNext = () => setIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goBack = () => setIndex((i) => Math.max(i - 1, 0))

  const measure = useCallback(() => {
    setRect(findRect(STEPS[clamped]?.target))
  }, [clamped])

  // Zielelement in den Sichtbereich holen, dann vermessen.
  useLayoutEffect(() => {
    if (!active) return
    const target = STEPS[clamped]?.target
    if (target) {
      const el = document.querySelector(`[data-tour="${target}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    const t = window.setTimeout(measure, 320)
    measure()
    return () => window.clearTimeout(t)
  }, [active, clamped, measure])

  // Ring/Bubble bei Scroll & Resize synchron halten.
  useEffect(() => {
    if (!active) return
    const onMove = () => measure()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [active, measure])

  const leave = () => {
    if (typeof window === 'undefined') return
    // Hash weg + voller Reload → raus aus dem isolierten Demo-Store.
    window.history.replaceState(null, '', '/')
    window.location.reload()
  }

  if (!active) {
    return (
      <button
        onClick={() => {
          setIndex(0)
          setActive(true)
        }}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-emerald-500/50 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-emerald-200 shadow-lg backdrop-blur transition hover:bg-slate-800"
      >
        ↻ Tour
      </button>
    )
  }

  const narrow = typeof window !== 'undefined' && window.innerWidth < 640
  const PAD = 8
  const BUBBLE_W = narrow ? Math.min(window.innerWidth - 24, 360) : 360

  // Bubble-Position relativ zum Ziel (mobil unten fixiert).
  let bubbleStyle: React.CSSProperties
  if (!rect || narrow) {
    bubbleStyle = {
      left: '50%',
      bottom: 16,
      transform: 'translateX(-50%)',
      width: BUBBLE_W,
    }
  } else {
    const vh = window.innerHeight
    const below = rect.top + rect.height + PAD
    const placeBelow = below + 180 < vh
    const top = placeBelow ? below : Math.max(12, rect.top - 180 - PAD)
    let left = rect.left + rect.width / 2 - BUBBLE_W / 2
    left = Math.max(12, Math.min(left, window.innerWidth - BUBBLE_W - 12))
    bubbleStyle = { left, top, width: BUBBLE_W }
  }

  return (
    <div className="fixed inset-0 z-50" aria-live="polite">
      {/* Spotlight: abgedunkelter Rest + Ring ums Ziel. Klick geht durch. */}
      {rect && !isLast && (
        <div
          className="pointer-events-none absolute rounded-xl ring-2 ring-emerald-400 transition-all duration-300"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: '0 0 0 9999px rgba(2,6,23,0.62)',
          }}
        />
      )}
      {(!rect || isLast) && (
        <div className="pointer-events-none absolute inset-0 bg-slate-950/70" />
      )}

      <div
        className="pointer-events-auto absolute rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl"
        style={bubbleStyle}
        role="dialog"
        aria-label={`Tour-Schritt ${clamped + 1} von ${STEPS.length}`}
      >
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
          Schritt {clamped + 1} / {STEPS.length}
        </div>
        <h3 className="text-sm font-bold text-white">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-slate-300">{step.body}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          {isLast ? (
            <>
              <button
                onClick={() => setActive(false)}
                className="text-xs font-medium text-slate-400 transition hover:text-slate-200"
              >
                Frei erkunden
              </button>
              <button
                onClick={leave}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Selbst loslegen →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActive(false)}
                className="text-xs font-medium text-slate-400 transition hover:text-slate-200"
              >
                Überspringen
              </button>
              <div className="flex items-center gap-2">
                {clamped > 0 && (
                  <button
                    onClick={goBack}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Zurück
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Weiter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
