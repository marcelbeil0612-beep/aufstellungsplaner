// Einmal-Skript: ersetzt pro Eintrag das `liveCoaching: [...]`-Array
// deterministisch durch die Werte aus livecoaching.map.json.
// Quelle (Inhalt) bewusst getrennt von der (mechanischen) Einfügung.
import { readFileSync, writeFileSync } from 'node:fs'

const map = JSON.parse(readFileSync('livecoaching.map.json', 'utf8'))
const ids = Object.keys(map)
const SYSTEMS = ['4-3-3','4-2-3-1','4-4-2','4-4-2-raute','3-5-2','3-4-3','5-3-2','5-4-1','4-1-4-1']

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
let replaced = 0
const missing = []

for (const our of SYSTEMS) {
  const file = `src/data/tacticBook/entries/our-${our}.ts`
  let src = readFileSync(file, 'utf8')
  for (const id of ids) {
    if (!id.startsWith(`${our}_vs_`)) continue
    const arr = map[id]
    if (!Array.isArray(arr) || arr.length < 5 || arr.length > 6) {
      throw new Error(`${id}: liveCoaching muss 5–6 Items haben, hat ${arr?.length}`)
    }
    // Region dieses Eintrags: ab `id: '<id>'` bis zum nächsten `id: '` oder EOF
    const idRe = new RegExp(`id: '${esc(id)}'`)
    const m = idRe.exec(src)
    if (!m) { missing.push(id); continue }
    const start = m.index
    const nextIdx = src.indexOf("id: '", start + 5)
    const end = nextIdx === -1 ? src.length : nextIdx
    const region = src.slice(start, end)
    // erstes liveCoaching: [ ... ] (flach, Strings ohne ']') ersetzen
    const lcRe = /liveCoaching:\s*\[[\s\S]*?\],/
    if (!lcRe.test(region)) { missing.push(id + ' (kein liveCoaching)'); continue }
    const items = arr.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(', ')
    const newRegion = region.replace(lcRe, `liveCoaching: [${items}],`)
    src = src.slice(0, start) + newRegion + src.slice(end)
    replaced++
  }
  writeFileSync(file, src)
}

console.log(`liveCoaching ersetzt: ${replaced}/${ids.length}`)
if (missing.length) {
  console.error('NICHT ersetzt:', missing.join(', '))
  process.exit(1)
}
if (replaced !== 81) {
  console.error(`Erwartet 81, ersetzt ${replaced}`)
  process.exit(1)
}
