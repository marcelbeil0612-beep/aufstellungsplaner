import type { Player, PlayerStatus } from '../types'
import { initials } from '../lib/photoUtils'
import { usePlayerPhotoUrl } from '../store/photoStore'

const statusBadge: Record<PlayerStatus, { icon: string; ring: string; title: string }> = {
  injured:   { icon: '🤕', ring: 'bg-rose-500 ring-rose-300/60',   title: 'verletzt' },
  suspended: { icon: '🟥', ring: 'bg-amber-500 ring-amber-300/60', title: 'gesperrt' },
  absent:    { icon: '🚫', ring: 'bg-slate-500 ring-slate-300/60', title: 'abwesend' },
}

type Props = {
  player: Player
  /** Optionaler Score (0–99) rechts-oben. */
  score?: number
  /** Kompaktere Variante (auf dem Feld) vs. Bank. */
  compact?: boolean
  /** Wenn im DragOverlay gerendert: etwas mehr Schatten + leichtes Scale für Tiefe. */
  elevated?: boolean
  /**
   * Feldseitiger Größenfaktor (0.4–1). Bei engem Block werden die Chips
   * verkleinert, damit sie sich nicht überlappen; das Foto bleibt erhalten,
   * das Namens-Label blendet unterhalb einer Schwelle aus.
   */
  scale?: number
}

/**
 * Rein visuelle Spielerdarstellung – ohne Drag-Logik.
 * Wird sowohl vom normalen `PlayerChip` als auch vom `DragOverlay` gerendert.
 */
export function PlayerChipVisual({ player, score, compact, elevated, scale = 1 }: Props) {
  const photoUrl = usePlayerPhotoUrl(player)
  const isGK = player.role === 'GK'
  const ringColor = isGK ? 'ring-amber-400' : 'ring-sky-400'
  const gradient = isGK
    ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800'
    : 'bg-gradient-to-br from-sky-400 via-sky-600 to-indigo-800'
  const s = Math.max(0.4, Math.min(1, scale))
  const baseAvatar = compact ? 64 : 56
  const avatarPx = Math.round(baseAvatar * s)
  const nameSize = compact ? 'text-[11px]' : 'text-xs'
  // Namens-Pille ist bei engem Block der Hauptüberlapper → früh ausblenden.
  // Die Identität trägt dann die Trikotnummer mitten im Kreis – eindeutiger
  // als das frühere Positionskürzel, das mehrfach vorkommen konnte.
  const showName = s >= 0.88

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
        {player.status && (
          <span
            className={[
              'absolute -bottom-1 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full text-[11px] shadow-lg ring-2 ring-slate-950',
              statusBadge[player.status].ring,
            ].join(' ')}
            title={statusBadge[player.status].title}
            aria-label={statusBadge[player.status].title}
          >
            <span aria-hidden>{statusBadge[player.status].icon}</span>
          </span>
        )}
        <div
          style={{ width: avatarPx, height: avatarPx }}
          className={[
            'relative overflow-hidden rounded-full shadow-xl ring-[3px] ring-offset-2 ring-offset-transparent',
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
          ) : typeof player.number === 'number' ? (
            <div
              style={{ fontSize: Math.round(avatarPx * 0.52) }}
              className="flex h-full w-full items-center justify-center font-black tabular-nums leading-none"
              aria-label={`Trikotnummer ${player.number}`}
            >
              {player.number}
            </div>
          ) : (
            <div
              style={{ fontSize: Math.round(avatarPx * 0.4) }}
              className="flex h-full w-full items-center justify-center font-black tracking-wide"
            >
              {initials(player.name)}
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-transparent"
          />
        </div>
      </div>
      {showName && (
        <span
          className={[
            'flex max-w-[110px] items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 font-bold text-white shadow backdrop-blur',
            nameSize,
          ].join(' ')}
        >
          {/* Nummer steht bei Foto-Spielern in der Pille (sonst mittig im Kreis). */}
          {photoUrl && typeof player.number === 'number' && (
            <span
              className="shrink-0 rounded bg-white/15 px-1 text-[10px] font-black tabular-nums text-amber-200"
              aria-label={`Trikotnummer ${player.number}`}
            >
              {player.number}
            </span>
          )}
          <span className="truncate">{player.name}</span>
        </span>
      )}
    </div>
  )
}
