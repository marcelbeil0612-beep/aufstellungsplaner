import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Fängt Render-Fehler im Baum, damit die App nicht in einen leeren/schwarzen
 * Bildschirm fällt. Zeigt eine kurze Fehlermeldung + Reload-Button.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In der Entwicklung landet das in der Konsole; in Production sieht man es im Safari-Web-Inspector.
    console.error('App-Fehler:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-slate-950 p-6 text-slate-200">
        <div className="max-w-md space-y-3 rounded-xl border border-rose-700/50 bg-rose-950/40 p-5 text-sm">
          <h1 className="text-base font-semibold text-rose-200">Da ist etwas schiefgelaufen.</h1>
          <p className="text-rose-200/80">
            Ein unerwarteter Fehler hat die App angehalten. Versuch es mit einem Neuladen. Falls
            der Fehler bestehen bleibt, hilft es, die App vom Homescreen einmal zu schließen.
          </p>
          {this.state.error.message && (
            <pre className="overflow-auto rounded bg-black/40 p-2 text-[11px] text-rose-100">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Neu laden
          </button>
        </div>
      </div>
    )
  }
}
