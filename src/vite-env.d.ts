/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_DEPLOYABLE_VERSION: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }