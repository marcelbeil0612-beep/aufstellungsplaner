import type { ReactNode } from 'react'
import { useEscapeKey } from '../lib/useEscapeKey'

type ModalSize = 'lg' | 'xl' | '2xl' | '4xl'

type Props = {
  open: boolean
  onClose: () => void
  /** Pflichttitel – wird im Kopf als `<h2>` gerendert. */
  title: string
  /** Optionale zweite Zeile unter dem Titel. */
  subtitle?: ReactNode
  /** Für Screenreader; default ist der Titel. */
  ariaLabel?: string
  /** Tailwind-`max-w-*`-Stufe; default `lg`. */
  size?: ModalSize
  /** Default `92vh`. RosterDialog nutzt 95vh, weil die Skill-Tabelle hoch wird. */
  maxHeight?: string
  /** Optionaler Inhalt, der als Sticky-Footer unter dem scrollbaren Body bleibt. */
  footer?: ReactNode
  children: ReactNode
}

const sizeClass: Record<ModalSize, string> = {
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
}

/**
 * Gemeinsame Hülle für Bottom-Sheet/Modal-Dialoge: Overlay, ESC, Klick-Außen,
 * Header mit Schließen-Knopf, optionaler Sticky-Footer. Body wird `flex-1`
 * scrollbar gerendert.
 */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  ariaLabel,
  size = 'lg',
  maxHeight = '92vh',
  footer,
  children,
}: Props) {
  useEscapeKey(open, onClose)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
    >
      <div
        className={[
          'flex w-full flex-col overflow-hidden rounded-t-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:rounded-2xl',
          sizeClass[size],
        ].join(' ')}
        style={{
          maxHeight,
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="-m-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-800 bg-slate-950/60 px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
