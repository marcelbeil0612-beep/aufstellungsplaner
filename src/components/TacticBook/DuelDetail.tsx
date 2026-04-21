import { useState } from 'react'
import type { DuelRating, PhaseTab, SectionKey, SystemId, TacticBookEntry, TacticBookView } from '../../data/tacticBook'
import { systemLabels } from '../../data/tacticBook'
import { PhaseHighlighter, phaseSections } from './PhaseHighlighter'

type Props = {
  ourSystem: SystemId
  opponentSystem: SystemId | null
  entry: TacticBookEntry | null
  view: TacticBookView
}

type Section = {
  key: SectionKey
  title: string
  icon: string
  items: string[]
  color: string
  /** Welche Views zeigen diesen Abschnitt überhaupt? */
  showIn: TacticBookView[]
}

const ratingStyle: Record<DuelRating, { bg: string; text: string; label: string }> = {
  vorteilhaft:  { bg: 'bg-emerald-500/15 ring-emerald-500/50', text: 'text-emerald-300', label: 'vorteilhaft' },
  ausgeglichen: { bg: 'bg-amber-500/15 ring-amber-500/50',     text: 'text-amber-300',   label: 'ausgeglichen' },
  unangenehm:   { bg: 'bg-rose-500/15 ring-rose-500/50',       text: 'text-rose-300',    label: 'unangenehm' },
}

function buildSections(entry: TacticBookEntry): Section[] {
  const all: Section[] = [
    { key: 'ourAdvantages',  title: 'Unsere Vorteile',           icon: '✅', items: entry.ourAdvantages,   color: 'border-emerald-700/50', showIn: ['matchday', 'coach', 'training'] },
    { key: 'ourDangers',     title: 'Unsere Gefahren',           icon: '⚠',  items: entry.ourDangers,      color: 'border-rose-700/50',    showIn: ['matchday', 'coach', 'training'] },
    { key: 'liveCoaching',   title: 'Live-Coaching',             icon: '📣', items: entry.liveCoaching,    color: 'border-sky-700/50',     showIn: ['matchday', 'coach', 'training'] },
    { key: 'adjustments',    title: 'Mögliche Ingame-Anpassung', icon: '🔁', items: entry.adjustments,     color: 'border-indigo-700/50',  showIn: ['matchday', 'coach', 'training'] },
    { key: 'importantZones', title: 'Wichtige Räume',            icon: '🗺', items: entry.importantZones,  color: 'border-slate-700',      showIn: ['coach', 'training'] },
    { key: 'pressing',       title: 'Pressing-Zuordnung',        icon: '🛡', items: entry.pressing,        color: 'border-slate-700',      showIn: ['coach', 'training'] },
    { key: 'inPossession',   title: 'Ballbesitz-Lösung',         icon: '⚽', items: entry.inPossession,    color: 'border-slate-700',      showIn: ['coach', 'training'] },
    { key: 'transition',     title: 'Umschaltmomente',           icon: '⚡', items: entry.transition,      color: 'border-slate-700',      showIn: ['coach', 'training'] },
  ]
  if (entry.trainingForms?.length) {
    all.push({ key: 'trainingForms', title: 'Trainingsformen', icon: '🎯', items: entry.trainingForms, color: 'border-slate-700', showIn: ['training'] })
  }
  return all
}

export function DuelDetail({ ourSystem, opponentSystem, entry, view }: Props) {
  const [phase, setPhase] = useState<PhaseTab | null>(null)

  if (!opponentSystem) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
        Wähle links ein Gegner-System, um das Duell zu öffnen.
      </div>
    )
  }
  if (!entry) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-slate-400">
        <div className="text-4xl" aria-hidden>📭</div>
        <p className="font-semibold text-slate-200">
          Noch nicht erfasst: {systemLabels[ourSystem]} gegen {systemLabels[opponentSystem]}
        </p>
        <p className="text-xs text-slate-500">
          In der nächsten Ausbaustufe wird dieses Duell ergänzt.
        </p>
      </div>
    )
  }

  const sections = buildSections(entry).filter((s) => s.showIn.includes(view))
  const emphasizedKeys = phase ? new Set<SectionKey>(phaseSections[phase]) : null
  const style = ratingStyle[entry.rating]

  return (
    <article className="flex h-full flex-col gap-4 overflow-hidden">
      {/* Kopf */}
      <header className={`flex flex-col gap-2 rounded-xl p-4 ring-1 ${style.bg}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-white">
            Unser {systemLabels[entry.ourSystem]} gegen {systemLabels[entry.opponentSystem]}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${style.text} ${style.bg}`}
          >
            {style.label}
          </span>
        </div>
        <p className="text-sm leading-snug text-slate-200">{entry.character}</p>
      </header>

      {/* Phasen-Highlighter: nur in Trainer- und Training-Ansicht zeigen */}
      {view !== 'matchday' && (
        <div className="shrink-0">
          <PhaseHighlighter value={phase} onChange={setPhase} />
        </div>
      )}

      {/* Abschnitte */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {sections.map((s) => {
          const dimmed = emphasizedKeys && !emphasizedKeys.has(s.key)
          const emphasized = emphasizedKeys && emphasizedKeys.has(s.key)
          return (
            <section
              key={s.key}
              className={[
                'rounded-xl border bg-slate-950/50 p-4 transition-opacity',
                s.color,
                emphasized ? 'ring-2 ring-sky-500/50' : '',
                dimmed ? 'opacity-50' : '',
              ].join(' ')}
            >
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span aria-hidden>{s.icon}</span>
                {s.title}
              </h4>
              {s.items.length === 0 ? (
                <p className="text-sm italic text-slate-500">– noch keine Einträge –</p>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
                  {s.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
        {view === 'training' && !entry.trainingForms?.length && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center text-xs text-slate-500">
            Trainingsformen und typische Probleme folgen in der nächsten Ausbaustufe.
          </div>
        )}
      </div>
    </article>
  )
}
