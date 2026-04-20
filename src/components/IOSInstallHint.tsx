import { useEffect, useState } from 'react'

const STORAGE_KEY = 'aufstellungsplaner:ios-hint-dismissed'

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua) ||
    // iPad ab iPadOS 13 meldet sich als Mac, aber mit Touch-Support
    (navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
  return isIos && isSafari
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  // iOS-spezifisch
  if ((window.navigator as Navigator & { standalone?: boolean }).standalone) return true
  // Standard
  return window.matchMedia?.('(display-mode: standalone)').matches ?? false
}

/**
 * Dezenter Hinweis für iPad-/iPhone-Nutzer:
 * iOS Safari bietet keinen automatischen Install-Prompt; der Nutzer muss
 * über das Teilen-Symbol → "Zum Home-Bildschirm" gehen.
 */
export function IOSInstallHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (!isIosSafari()) return
    if (localStorage.getItem(STORAGE_KEY) === '1') return
    setShow(true)
  }, [])

  if (!show) return null

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  return (
    <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/70 px-4 py-3 text-sm text-emerald-100 shadow-lg sm:mx-6">
      <span aria-hidden className="mt-0.5 text-lg">📲</span>
      <div className="flex-1 leading-snug">
        <p className="font-semibold text-white">Als App installieren</p>
        <p className="text-emerald-200/90">
          In Safari auf das Teilen-Symbol{' '}
          <span className="inline-block rounded border border-emerald-300/40 px-1 text-xs">↑</span>{' '}
          tippen, dann <em>Zum Home-Bildschirm</em>.
        </p>
      </div>
      <button
        onClick={dismiss}
        className="-m-1 rounded-md p-1 text-emerald-200/70 transition hover:bg-white/10 hover:text-white"
        aria-label="Hinweis ausblenden"
      >
        ✕
      </button>
    </div>
  )
}
