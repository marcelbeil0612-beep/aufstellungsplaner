import { useEffect, useState } from 'react'
import { demoExportInput } from '../data/demoLineup'
import { renderLineupPng } from '../lib/exportLineup'
import { Modal } from './Modal'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Read-only-Vorschau der festen Demo-Aufstellung. Rendert dieselbe
 * Spielfeld-Grafik wie der PNG-Export (kein Drag-and-Drop, kein
 * Store-Zugriff, kein Import nötig) und bietet einen CTA, selbst
 * loszulegen.
 */
export function DemoDialog({ open, onClose }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return
    let url: string | null = null
    let cancelled = false
    setFailed(false)
    setImgUrl(null)
    renderLineupPng(demoExportInput())
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setImgUrl(url)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Beispiel-Aufstellung"
      subtitle="So sieht ein fertiger Plan aus – nur zum Ansehen"
      ariaLabel="Demo-Aufstellung"
      size="xl"
      footer={
        <button
          onClick={onClose}
          className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-500"
        >
          Eigene Aufstellung bauen
        </button>
      }
    >
      <div className="flex flex-col items-center gap-3 overflow-y-auto px-5 py-4">
        <p className="text-center text-sm text-slate-300">
          Diese Aufstellung ist ein Beispiel mit erfundenen Spielern. Du musst
          nichts importieren – schließe das Fenster, um deine eigene zu bauen.
        </p>
        {failed ? (
          <p className="rounded-lg border border-rose-700/40 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
            Die Vorschau konnte nicht erzeugt werden. Schließe das Fenster und
            leg direkt selbst los.
          </p>
        ) : imgUrl ? (
          <img
            src={imgUrl}
            alt="Beispiel-Aufstellung im 4-3-3"
            className="w-full max-w-[420px] rounded-xl border border-slate-800 shadow-lg"
          />
        ) : (
          <div className="flex h-64 w-full max-w-[420px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-sm text-slate-500">
            Vorschau wird erstellt …
          </div>
        )}
      </div>
    </Modal>
  )
}
