import { useEffect } from 'react'

/**
 * Registriert einen ESC-Handler, solange `active` true ist. Wird von allen
 * Dialogen genutzt, damit die identische `useEffect`-Boilerplate nicht in
 * jedem Dialog-Modul liegt.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}
