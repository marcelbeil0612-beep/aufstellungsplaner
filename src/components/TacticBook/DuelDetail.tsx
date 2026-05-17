import { useState } from 'react'
import type {
  DuelRating,
  PhaseAnalysis,
  PhaseKey,
  SystemId,
  TacticBookEntry,
} from '../../data/tacticBook'
import { phaseMeta, phaseOrder, systemLabels } from '../../data/tacticBook'
import { PhaseHighlighter } from './PhaseHighlighter'

type Props = {
  ourSystem: SystemId
  opponentSystem: SystemId | null
  entry: TacticBookEntry | null
}

const ratingStyle: Record<DuelRating, { bg: string; text: string; label: string }> = {
  vorteilhaft:  { bg: 'bg-emerald-500/15 ring-emerald-500/50', text: 'text-emerald-300', label: 'vorteilhaft' },
  ausgeglichen: { bg: 'bg-amber-500/15 ring-amber-500/50',     text: 'text-amber-300',   label: 'ausgeglichen' },
  unangenehm:   { bg: 'bg-rose-500/15 ring-rose-500/50',       text: 'text-rose-300',    label: 'unangenehm' },
}

const phaseAccent: Record<PhaseKey, string> = {
  ownPossession: 'border-emerald-700/40 bg-emerald-950/20',
  afterLoss:     'border-rose-700/40 bg-rose-950/20',
  oppPossession: 'border-sky-700/40 bg-sky-950/20',
  afterGain:     'border-amber-700/40 bg-amber-950/20',
}

const pillarMeta: Array<{
  key: keyof PhaseAnalysis
  label: string
  icon: string
  tone: string
}> = [
  { key: 'spaces',     label: 'Räume / Engpässe',     icon: '🗺', tone: 'text-slate-300' },
  { key: 'advantages', label: 'Unsere Vorteile',       icon: '✅', tone: 'text-emerald-300' },
  { key: 'dangers',    label: 'Unsere Gefahren',       icon: '⚠',  tone: 'text-rose-300' },
  { key: 'keyActions', label: 'Konkrete Aktionen',     icon: '🎯', tone: 'text-sky-300' },
]

function BulletList({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-sm italic text-slate-500">– noch keine Einträge –</p>
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-200">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function PhaseCard({ phaseKey, analysis }: { phaseKey: PhaseKey; analysis: PhaseAnalysis }) {
  const meta = phaseMeta[phaseKey]
  return (
    <section className={`rounded-xl border p-4 ${phaseAccent[phaseKey]}`}>
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
          <span aria-hidden>{meta.icon}</span>
          {meta.label}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">{meta.tooltip}</span>
      </header>
      <div className="space-y-3">
        {pillarMeta.map((pillar) => (
          <div key={pillar.key}>
            <h5 className={`mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${pillar.tone}`}>
              <span aria-hidden>{pillar.icon}</span>
              {pillar.label}
            </h5>
            <BulletList items={analysis[pillar.key]} />
          </div>
        ))}
      </div>
    </section>
  )
}

export function DuelDetail({ ourSystem, opponentSystem, entry }: Props) {
  const [phaseFilter, setPhaseFilter] = useState<PhaseKey | null>(null)

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
        <p className="text-xs text-slate-500">In der nächsten Ausbaustufe wird dieses Duell ergänzt.</p>
      </div>
    )
  }

  const style = ratingStyle[entry.rating]

  // Coaching-Tools (Live-Coaching + Anpassungen) erscheinen prominent oben —
  // das ist das, was der Trainer am Spieltag zuerst sieht.
  const coachingTools = (
    <div className="grid gap-3 sm:grid-cols-2">
      <section className="rounded-xl border border-sky-700/50 bg-slate-950/50 p-4">
        <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
          <span aria-hidden>📣</span> Live-Coaching
        </h4>
        <BulletList items={entry.liveCoaching} />
      </section>
      <section className="rounded-xl border border-indigo-700/50 bg-slate-950/50 p-4">
        <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
          <span aria-hidden>🔁</span> Mögliche Ingame-Anpassung
        </h4>
        <BulletList items={entry.adjustments} />
      </section>
    </div>
  )

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

      <div className="shrink-0">
        <PhaseHighlighter value={phaseFilter} onChange={setPhaseFilter} />
      </div>

      {/* Hauptinhalt */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {/* Coaching-Tools immer ganz oben */}
        {coachingTools}

        {phaseOrder
          .filter((k) => phaseFilter === null || phaseFilter === k)
          .map((key) => <PhaseCard key={key} phaseKey={key} analysis={entry.phases[key]} />)}
      </div>
    </article>
  )
}
