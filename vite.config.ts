import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'FormaXI – Aufstellung, Wechselplan & Systembuch',
        short_name: 'FormaXI',
        description: 'FormaXI: Aufstellung per Drag-and-Drop, Wechselplan und taktisches Systembuch für Trainer – lokal, ohne Cloud.',
        lang: 'de',
        dir: 'ltr',
        theme_color: '#1f6b3a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/app',
        icons: [
          { src: 'pwa-192x192.png',         sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',         sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: '/app/index.html',
        // Statische Seiten (Landingpage auf "/" und Rechts-/Infoseiten) dürfen
        // NICHT vom SPA-Shell-Fallback überlagert werden – sie haben eigene
        // HTML-Dateien.
        navigateFallbackDenylist: [
          /^\/(?:hilfe|preise|agb|datenschutz|widerruf|impressum|landing)(?:\/|$)/,
          /^\/$/,
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { host: true, port: 5173 },
  // Die App-HTML wird nach dist/app/index.html gebaut, damit "/" für die
  // statische Landingpage frei bleibt (siehe vercel.json-Rewrites).
  build: {
    rollupOptions: {
      input: 'app/index.html',
    },
  },
})
