/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_WS_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
