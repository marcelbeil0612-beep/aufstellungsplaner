import type { Player } from '../types'
import { initials } from '../lib/photoUtils'
import { usePlayerPhotoUrl } from '../store/photoStore'

type Props = {
  player: Player
  /** Optionales Positionskürzel links-oben. */
  positionShort?: string
  /** Optionaler Score (0–99) rechts-oben. */
  score?: number
  /** Kompaktere Variante (auf dem Feld) vs. Bank. */
  compact?: boolean
  /** Wenn im DragOverlay gerendert: etwas mehr Schatten + leichtes Scale für Tiefe. */
  elevated?: boolean
}

/**
 * Rein visuelle Spielerdarstellung – ohne Drag-Logik.
 * Wird sowohl vom normalen `PlayerChip` als auch vom `DragOverlay` gerendert.
 */
export function PlayerChipVisual({ player, positionShort, score, compact, elevated }: Props) {
  const photoUrl = usePlayerPhotoUrl(player)
  const isGK = player.role === 'GK'
  const ringColor = isGK ? 'ring-amber-400' : 'ring-sky-400'
  const gradient = isGK
    ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800'
    : 'bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-800'
  const avatarSize = compact ? 'h-16 w-16' : 'h-14 w-14'
  const nameSize = compact ? 'text-[11px]' : 'text-xs'
  const initialsSize = compact ? 'text-lg' : 'text-base'

  return (
    <div
      className={[
        'pointer-events-none flex flex-col items-center gap-1.5 text-white',
        elevated ? 'scale-[1.04] drop-shadow-[0_18px_20px_rgba(0,0,0,0.55)]' : '',
      ].join(' ')}
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-2 bottom-[-4px] h-2 rounded-full bg-black/50 blur-md"
        />
        {positionShort && (
          <span
            className={[
              'absolute -left-1.5 -top-1.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-lg ring-1',
              isGK ? 'bg-amber-500 ring-amber-300/60' : 'bg-sky-600 ring-sky-300/60',
            ].join(' ')}
          >
            {positionShort}
          </span>
        )}
        {typeof score === 'number' && (
          <span
            className={[
              'absolute -right-1.5 -top-1.5 z-10 min-w-[22px] rounded-md px-1.5 py-0.5 text-center text-[11px] font-black shadow-lg ring-1',
              score >= 80 ? 'bg-emerald-500 text-white ring-emerald-300/60' :
              score >= 65 ? 'bg-sky-500 text-white ring-sky-300/60' :
              score >= 50 ? 'bg-amber-500 text-white ring-amber-300/60' :
                            'bg-rose-500 text-white ring-rose-300/60',
            ].join(' ')}
            title="Score auf dieser Position"
          >
            {score.toFixed(0)}
          </span>
        )}
        <div
          className={[
            'relative overflow-hidden rounded-full shadow-xl ring-[3px] ring-offset-2 ring-offset-transparent',
            avatarSize,
            ringColor,
            photoUrl ? 'bg-slate-950' : gradient,
          ].join(' ')}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center font-black tracking-wide ${initialsSize}`}>
              {initials(player.name)}
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent"
          />
        </div>
      </div>
      <span
        className={[
          'max-w-[96px] truncate rounded-md bg-black/70 px-2 py-0.5 font-bold text-white shadow backdrop-blur',
          nameSize,
        ].join(' ')}
      >
        {player.name}
      </span>
    </div>
  )
}
