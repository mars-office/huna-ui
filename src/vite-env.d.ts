/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEPLOYABLE_VERSION: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }