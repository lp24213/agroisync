/// <reference types="vite/client" />

// Declarações mínimas para import.meta.env usadas pelo projeto
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SOME_OTHER?: string;
  // add other VITE_ prefixed env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
