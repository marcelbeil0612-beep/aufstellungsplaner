/**
 * Schlanke Leiste im Demo-Modus (`…/#demo`). Macht unmissverständlich
 * klar, dass nichts gespeichert wird, und bietet den Ausstieg in die
 * echte App (voller Reload → echter, persistenter Store).
 */
export function DemoBanner() {
  const leave = () => {
    if (typeof window === 'undefined') return
    // Hash entfernen + voller Reload: nur so verlässt die Seite den
    // isolierten Demo-Store (Storage-Wahl hängt am Hash). Ein reiner
    // `assign('/')` von `/#demo` wäre nur ein Hash-Wechsel ohne Reload.
    window.history.replaceState(null, '', '/')
    window.location.reload()
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/50 bg-amber-900/30 px-4 py-2 text-xs text-amber-100">
      <span>
        <span className="font-semibold">Demo-Modus</span> · Beispiel-Mannschaft
        zum Ausprobieren – nichts wird gespeichert, alle Pro-Funktionen sind frei.
      </span>
      <button
        onClick={leave}
        className="shrink-0 rounded-md bg-amber-500 px-3 py-1 font-semibold text-slate-950 transition hover:bg-amber-400"
      >
        Selbst loslegen →
      </button>
    </div>
  )
}
