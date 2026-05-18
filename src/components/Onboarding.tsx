import { useEffect, useState } from 'react'
import { Modal } from './Modal'

const ONBOARDING_SEEN_KEY = 'aufstellungsplaner:onboarding-seen'

const steps = [
  {
    title: 'Kader anlegen',
    text: 'Erfasse deine Spieler mit Positionen und Stärken. Alles bleibt lokal auf deinem Gerät.',
  },
  {
    title: 'Aufstellung bauen',
    text: 'Ziehe Spieler aufs Feld, wechsle System und prüfe mit einem Blick, wo jeder am besten passt.',
  },
  {
    title: 'Teilen',
    text: 'Exportiere die Aufstellung als Bild oder teile einen Link für Trainerteam und Spieltag.',
  },
]

function hasSeenOnboarding() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true'
}

export function Onboarding() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(!hasSeenOnboarding())
  }, [])

  const markSeen = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_SEEN_KEY, 'true')
    }
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={markSeen}
      title="In 3 Schritten zur Aufstellung"
      subtitle="Kader anlegen → Aufstellung bauen → Teilen"
      size="xl"
      footer={
        <button
          type="button"
          onClick={markSeen}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Los geht's
        </button>
      }
    >
      <div className="overflow-y-auto px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <section
              key={step.title}
              className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-300">
                {index + 1}
              </div>
              <h3 className="text-sm font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p>
            </section>
          ))}
        </div>
      </div>
    </Modal>
  )
}
