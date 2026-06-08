// HTML-Template (handgeschriebenes Print-CSS, kein Tailwind) für das
// Lead-Magnet-PDF "Die 5 wichtigsten taktischen Duelle der Amateurliga".
// 8 Seiten A4 hochkant. Dunkles FormaXI-Brand-Theme (slate-950 + emerald).
import { pitchBackdrop } from './pitch'

export type DuelRating = 'vorteilhaft' | 'ausgeglichen' | 'unangenehm'

export type DuelVM = {
  /** 1-basiert */
  index: number
  /** physische PDF-Seitennummer (3–7) */
  pageNumber: number
  title: string
  rating: DuelRating
  character: string
  advantages: string[]
  dangers: string[]
  spaces: string[]
  pressing: string[]
  coaching: string[]
  pitchSVG: string
}

export type TemplateData = {
  duels: DuelVM[]
  totalPages: number
  logoDataUri: string | null
  qrDataUri: string
  dateLabel: string
}

const RATING_META: Record<DuelRating, { label: string; color: string }> = {
  vorteilhaft: { label: 'Vorteilhaft', color: '#22c55e' },
  ausgeglichen: { label: 'Ausgeglichen', color: '#f59e0b' },
  unangenehm: { label: 'Unangenehm', color: '#ef4444' },
}

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const bullets = (items: string[]): string =>
  `<ul class="lm-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`

// ── Cover (Seite 1) ─────────────────────────────────────────────────────────
function renderCover(d: TemplateData): string {
  const counts = d.duels.reduce<Record<DuelRating, number>>(
    (acc, x) => ((acc[x.rating] = (acc[x.rating] ?? 0) + 1), acc),
    { vorteilhaft: 0, ausgeglichen: 0, unangenehm: 0 },
  )
  const spread = (['vorteilhaft', 'ausgeglichen', 'unangenehm'] as DuelRating[])
    .filter((r) => counts[r] > 0)
    .map(
      (r) =>
        `<span class="lm-chip"><span class="lm-dot" style="background:${RATING_META[r].color}"></span>${counts[r]}× ${RATING_META[r].label.toLowerCase()}</span>`,
    )
    .join('')

  const logo = d.logoDataUri
    ? `<img class="lm-cover-logo" src="${d.logoDataUri}" alt="FormaXI" />`
    : `<div class="lm-cover-wordmark">Forma<span>XI</span></div>`

  return `
  <section class="page page--cover">
    <div class="lm-backdrop-wrap">${pitchBackdrop()}</div>
    <div class="lm-cover-inner">
      <header class="lm-cover-head">${logo}</header>
      <div class="lm-cover-body">
        <div class="lm-kicker">Systembuch-Auszug · FormaXI</div>
        <h1 class="lm-cover-title">Die 5 wichtigsten<br/>taktischen Duelle<br/>der Amateurliga</h1>
        <div class="lm-spread">
          <div class="lm-spread-count">5&nbsp;Duelle</div>
          <div class="lm-spread-chips">${spread}</div>
        </div>
      </div>
      <footer class="lm-cover-foot">Stand ${esc(d.dateLabel)}</footer>
    </div>
  </section>`
}

// ── Story (Seite 2) ─────────────────────────────────────────────────────────
function renderStory(d: TemplateData): string {
  return `
  <section class="page page--story">
    <div class="lm-backdrop-wrap lm-backdrop-wrap--soft">${pitchBackdrop()}</div>
    <div class="lm-page-inner">
      <h2 class="lm-h2">Wer das gebaut hat</h2>
      <div class="lm-story">
        <p>Hi, ich bin Marcel.</p>
        <p>
          Coache U15 in Steinheim (Bayerisch-Schwaben), B- und C-Lizenz, stehe seit
          vielen Jahren in irgendeiner Coachzone. Mein Trainerverständnis in einem Satz:
          <span class="lm-credo">Pep mit Ball. Klopp gegen Ball. Respekt immer.</span>
          Spielintelligenz vor Athletik. Charakter vor Talent.
        </p>
        <p>
          FormaXI ist entstanden, weil ich es irgendwann nicht mehr eingesehen habe, mit
          Stift und Zettel auf der Bank zu stehen — während ich von meinen Spielern erwarte,
          vor dem Ball schon drei Optionen zu sehen.
        </p>
        <p>
          Das Systembuch in der App ist die Verdichtung dessen, was ich über Jahre gegen
          jedes System aufgeschrieben habe. Hier sind die fünf wichtigsten Duelle als
          Vorgeschmack. Die anderen 76 findest du in <strong>FormaXI&nbsp;Pro</strong>.
        </p>
      </div>
      <div class="lm-preview">
        <div class="lm-preview-label">Pro Duell auf den nächsten Seiten</div>
        <div class="lm-preview-tags">
          <span>Spielcharakter</span><span>Unsere Vorteile</span><span>Unsere Gefahren</span>
          <span>Wichtige Räume</span><span>Pressing-Zuordnung</span><span>Live-Coaching-Zurufe</span>
        </div>
      </div>
    </div>
  </section>`
}

// ── Duell (eine, bei Bedarf zwei A4-Seiten) ─────────────────────────────────
function renderDuel(duel: DuelVM): string {
  const r = RATING_META[duel.rating]
  const coachingCells = duel.coaching
    .map((c) => `<div class="lm-zuruf">${esc(c)}</div>`)
    .join('')
  return `
  <section class="page page--duel">
    <div class="lm-page-inner">
      <header class="lm-duel-head">
        <div class="lm-duel-no">Duell ${duel.index}</div>
        <h2 class="lm-duel-title">${esc(duel.title)}</h2>
        <div class="lm-duel-rating">
          <span class="lm-dot lm-dot--lg" style="background:${r.color}"></span>
          <span class="lm-rating-label" style="color:${r.color}">${r.label}</span>
        </div>
      </header>
      <p class="lm-character">${esc(duel.character)}</p>

      <div class="lm-pitch-wrap">${duel.pitchSVG}
        <div class="lm-pitch-legend">
          <span><span class="lm-leg-dot lm-leg-dot--solid"></span>Unser System</span>
          <span><span class="lm-leg-dot lm-leg-dot--opp"></span>Gegner</span>
        </div>
      </div>

      <div class="lm-grid">
        <div class="lm-cell">
          <h3 class="lm-cell-h lm-cell-h--good">Unsere Vorteile</h3>
          ${bullets(duel.advantages)}
        </div>
        <div class="lm-cell">
          <h3 class="lm-cell-h lm-cell-h--bad">Unsere Gefahren</h3>
          ${bullets(duel.dangers)}
        </div>
        <div class="lm-cell">
          <h3 class="lm-cell-h">Wichtige Räume</h3>
          ${bullets(duel.spaces)}
        </div>
        <div class="lm-cell">
          <h3 class="lm-cell-h">Pressing-Zuordnung</h3>
          ${bullets(duel.pressing)}
        </div>
      </div>

      <div class="lm-coaching">
        <div class="lm-coaching-h"><span class="lm-mic">🎙</span> Live-Coaching-Zurufe</div>
        <div class="lm-coaching-grid">${coachingCells}</div>
      </div>
    </div>
  </section>`
}

// ── Outro / CTA (Seite 8) ───────────────────────────────────────────────────
function renderOutro(d: TemplateData): string {
  return `
  <section class="page page--outro">
    <div class="lm-backdrop-wrap lm-backdrop-wrap--soft">${pitchBackdrop()}</div>
    <div class="lm-page-inner lm-outro-inner">
      <h2 class="lm-h2 lm-outro-title">Bereit für alle 81 Duelle?</h2>
      <ul class="lm-outro-list">
        <li><strong>81 ausgearbeitete System-vs-System-Duelle</strong><span>Jedes System gegen jedes – komplett analysiert</span></li>
        <li><strong>Phasen-Umschalter mit/gegen Ball</strong><span>Aufstellung kippt live in die richtige Struktur</span></li>
        <li><strong>Hungarian-Auto-Aufstellung</strong><span>Optimale Elf per Klick aus deinem Kader</span></li>
      </ul>

      <div class="lm-cta">
        <img class="lm-qr" src="${d.qrDataUri}" alt="QR-Code formaxi.de" />
        <div class="lm-cta-text">
          <div class="lm-cta-go">Jetzt scannen</div>
          <div class="lm-cta-url">formaxi.de</div>
          <div class="lm-price">
            <span class="lm-price-pill">Lifetime <strong>49&nbsp;€</strong></span>
            <span class="lm-price-pill">Jahresabo <strong>24,90&nbsp;€</strong></span>
          </div>
        </div>
      </div>

      <div class="lm-signoff">Indie-gebaut von einem Trainer für Trainer.</div>
    </div>
  </section>`
}

// ── Dokument ─────────────────────────────────────────────────────────────────
export function renderDocument(d: TemplateData): string {
  const pages = [
    renderCover(d),
    renderStory(d),
    ...d.duels.map((duel) => renderDuel(duel)),
    renderOutro(d),
  ].join('\n')

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>FormaXI Systembuch-Auszug</title>
<style>${CSS}</style>
</head>
<body>${pages}</body>
</html>`
}

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
:root{
  --bg:#0f172a; --bg2:#16233b; --panel:#1c2942; --panel2:#162338;
  --border:rgba(148,163,184,0.18);
  --text:#e7edf6; --muted:#9fb0c6;
  --green:#22c55e; --green-light:#34d399; --amber:#f59e0b; --red:#ef4444;
}
*{margin:0;padding:0;box-sizing:border-box;}
@page{ size:A4; margin:0; }
html,body{ background:#0f172a; }
body{
  font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;
  color:var(--text); -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
/* Druckfläche je A4-Seite = 210×297mm minus page.pdf-Margins (12 li/re/oben, 18 unten). */
.page{
  position:relative; width:186mm; height:267mm; overflow:hidden;
  background:linear-gradient(160deg,#10192e 0%,#0c1424 60%,#0a1120 100%);
  page-break-after:always; break-after:page;
}
.page:last-child{ page-break-after:auto; break-after:auto; }
.lm-page-inner{ position:relative; z-index:2; padding:11mm 13mm 0; height:100%; display:flex; flex-direction:column; }

/* Duell-Seiten dürfen bei Bedarf auf eine zweite Seite fließen, statt Inhalt zu kappen.
   Karten bleiben dabei dank break-inside:avoid stets unzerschnitten. */
.page--duel{ height:auto; min-height:267mm; overflow:visible; break-inside:auto; }
/* Block-Flow (statt Flex) → saubere Seiten-Fragmentierung mit break-inside:avoid. */
.page--duel .lm-page-inner{ display:block; height:auto; padding-bottom:6mm; }

/* Karten/Blöcke NIE über einen Seitenumbruch zerschneiden – ganz auf nächste Seite rutschen. */
.lm-duel-head, .lm-character, .lm-pitch-wrap, .lm-cell, .lm-coaching, .lm-zuruf{
  break-inside:avoid; page-break-inside:avoid;
}

/* Hintergrund-Spielfeld */
.lm-backdrop-wrap{ position:absolute; inset:0; z-index:0; opacity:0.10; }
.lm-backdrop-wrap--soft{ opacity:0.06; }
.lm-backdrop{ width:100%; height:100%; }

/* Footer wird nativ von Puppeteer im unteren Seitenrand gerendert (kein DOM-Element),
   damit er den Inhalt nie überlappt – siehe footerTemplate in generate.ts. */

/* ── Cover ── */
.page--cover{ background:radial-gradient(120% 80% at 50% 0%,#16315f 0%,#0c1526 55%,#080e1b 100%); }
.lm-cover-inner{ position:relative; z-index:2; height:100%; padding:18mm 16mm 12mm; display:flex; flex-direction:column; }
.lm-cover-head{ display:flex; margin-top:4mm; }
/* Reine „FormaXI"-Wortmarke (transparent, ohne Kachel) – groß, damit der obere
   Spielfeld-Bereich nicht so leer wirkt. */
.lm-cover-logo{ height:24mm; width:auto; margin:0; }
.lm-cover-wordmark{ font-size:22pt; font-weight:800; letter-spacing:-.01em; color:#fff; }
.lm-cover-wordmark span{ color:var(--green); }
.lm-cover-body{ margin-top:auto; margin-bottom:auto; }
.lm-kicker{ font-size:11pt; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--green-light); margin-bottom:7mm; }
.lm-cover-title{ font-size:33pt; line-height:1.08; font-weight:800; letter-spacing:-.02em; color:#fff; }
.lm-spread{ margin-top:11mm; display:flex; align-items:center; gap:6mm; flex-wrap:wrap; }
.lm-spread-count{ font-size:15pt; font-weight:800; color:#fff; padding-right:6mm; border-right:1px solid var(--border); }
.lm-spread-chips{ display:flex; gap:5mm; flex-wrap:wrap; }
.lm-chip{ display:inline-flex; align-items:center; gap:2mm; font-size:10.5pt; font-weight:600; color:var(--text); }
.lm-dot{ display:inline-block; width:3.4mm; height:3.4mm; border-radius:50%; box-shadow:0 0 0 1px rgba(255,255,255,0.15); }
.lm-dot--lg{ width:4.4mm; height:4.4mm; }
.lm-cover-foot{ font-size:10pt; color:var(--muted); letter-spacing:.04em; }

/* ── Story ── */
.lm-h2{ font-size:21pt; font-weight:800; letter-spacing:-.01em; color:#fff; margin-bottom:7mm; }
.lm-h2::after{ content:''; display:block; width:18mm; height:1.4mm; background:var(--green); border-radius:2px; margin-top:3mm; }
.lm-story p{ font-size:12pt; line-height:1.62; color:var(--text); margin-bottom:5mm; max-width:150mm; }
.lm-story p:first-child{ font-size:13.5pt; font-weight:700; color:#fff; }
.lm-credo{ display:block; margin:2mm 0; font-size:14pt; font-weight:800; color:var(--green-light); letter-spacing:-.01em; }
.lm-preview{ margin-top:auto; margin-bottom:14mm; padding:6mm 7mm; background:rgba(34,197,94,0.07); border:1px solid rgba(34,197,94,0.22); border-radius:4mm; }
.lm-preview-label{ font-size:9pt; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:var(--green-light); margin-bottom:3.5mm; }
.lm-preview-tags{ display:flex; flex-wrap:wrap; gap:3mm; }
.lm-preview-tags span{ font-size:10pt; font-weight:600; color:var(--text); background:rgba(255,255,255,0.05); border:1px solid var(--border); border-radius:99px; padding:1.6mm 4mm; }

/* ── Duell ──
   Vertikal verdichtet, damit ein Duell mit ALLEN Zurufen auf EINE A4-Seite passt
   (break-inside:avoid bleibt als Sicherheitsnetz für Ausnahmefälle aktiv). */
.lm-duel-head{ display:flex; align-items:baseline; gap:4mm; flex-wrap:wrap; }
.lm-duel-no{ font-size:9pt; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--green-light); }
.lm-duel-title{ font-size:16.5pt; font-weight:800; letter-spacing:-.01em; color:#fff; flex:1 1 auto; }
.lm-duel-rating{ display:inline-flex; align-items:center; gap:2mm; }
.lm-rating-label{ font-size:10.5pt; font-weight:700; }
.lm-character{ font-size:9.5pt; line-height:1.42; color:var(--muted); margin-top:2mm; padding-bottom:2.5mm; border-bottom:1px solid var(--border); }

.lm-pitch-wrap{ display:flex; flex-direction:column; align-items:center; margin:2.5mm 0 1.5mm; }
.lm-pitch{ width:38mm; height:auto; filter:drop-shadow(0 3mm 6mm rgba(0,0,0,0.45)); }
.lm-pitch-legend{ display:flex; gap:7mm; margin-top:1.8mm; font-size:8pt; color:var(--muted); }
.lm-pitch-legend span{ display:inline-flex; align-items:center; gap:1.6mm; }
.lm-leg-dot{ width:3mm; height:3mm; border-radius:50%; }
.lm-leg-dot--solid{ background:var(--green); }
.lm-leg-dot--opp{ background:var(--red); }

.lm-grid{ display:grid; grid-template-columns:1fr 1fr; gap:2.8mm 4.5mm; margin-top:2mm; }
.lm-cell{ background:rgba(255,255,255,0.025); border:1px solid var(--border); border-radius:3mm; padding:2.8mm 3.5mm; }
.lm-cell-h{ font-size:9pt; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#fff; margin-bottom:2mm; padding-left:3mm; border-left:1mm solid var(--muted); }
.lm-cell-h--good{ border-left-color:var(--green); color:var(--green-light); }
.lm-cell-h--bad{ border-left-color:var(--red); color:#fca5a5; }
.lm-list{ list-style:none; }
.lm-list li{ position:relative; font-size:9pt; line-height:1.34; color:var(--text); padding-left:4mm; margin-bottom:1.3mm; }
.lm-list li::before{ content:''; position:absolute; left:0; top:1.4mm; width:1.6mm; height:1.6mm; border-radius:50%; background:var(--green); opacity:.65; }

.lm-coaching{ margin-top:3mm; padding:3.2mm 4mm; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.25); border-radius:3.5mm; }
.lm-coaching-h{ font-size:9.5pt; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:var(--green-light); margin-bottom:2.5mm; }
.lm-mic{ font-size:11pt; }
/* 6 Zurufe in 3 Spalten → 2 Zeilen statt 3 (spart vertikalen Platz). */
.lm-coaching-grid{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:2.4mm 3.5mm; }
.lm-zuruf{ font-size:9pt; font-weight:700; font-style:italic; color:#fff; padding-left:3mm; border-left:0.8mm solid var(--green); line-height:1.25; }

/* ── Outro ── */
.lm-outro-inner{ justify-content:flex-start; }
.lm-outro-title{ font-size:24pt; margin-top:6mm; }
.lm-outro-list{ list-style:none; margin-top:9mm; }
.lm-outro-list li{ position:relative; padding:0 0 5mm 11mm; }
.lm-outro-list li::before{ content:'✓'; position:absolute; left:0; top:-0.5mm; width:7mm; height:7mm; border-radius:50%; background:var(--green); color:#04210f; font-weight:900; font-size:10pt; display:flex; align-items:center; justify-content:center; }
.lm-outro-list strong{ display:block; font-size:13pt; color:#fff; font-weight:800; }
.lm-outro-list span{ font-size:10.5pt; color:var(--muted); }
.lm-cta{ margin-top:6mm; display:flex; align-items:center; gap:9mm; padding:8mm; background:rgba(255,255,255,0.04); border:1px solid rgba(34,197,94,0.3); border-radius:5mm; }
.lm-qr{ width:42mm; height:42mm; background:#fff; padding:2.5mm; border-radius:3mm; }
.lm-cta-go{ font-size:11pt; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--green-light); }
.lm-cta-url{ font-size:26pt; font-weight:800; color:#fff; letter-spacing:-.01em; margin:1mm 0 4mm; }
.lm-price{ display:flex; gap:4mm; flex-wrap:wrap; }
.lm-price-pill{ font-size:11pt; color:var(--text); background:rgba(255,255,255,0.06); border:1px solid var(--border); border-radius:99px; padding:2mm 5mm; }
.lm-price-pill strong{ color:#fff; }
.lm-signoff{ margin-top:14mm; font-size:13pt; font-weight:700; font-style:italic; color:var(--green-light); text-align:center; }
`
