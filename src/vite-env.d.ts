/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
    readonly VITE_DEPLOYABLE_VERSION: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }