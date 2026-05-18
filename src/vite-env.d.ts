/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_PADDLE_ENV?: 'sandbox' | 'production'
  readonly VITE_PADDLE_CLIENT_TOKEN?: string
  readonly VITE_PADDLE_PRICE_YEAR?: string
  readonly VITE_PADDLE_PRICE_MONTH?: string
  readonly VITE_PADDLE_PRICE_LIFETIME?: string
  readonly VITE_LICENSE_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
