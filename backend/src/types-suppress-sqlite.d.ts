// Declarações mínimas para suprimir erros quando sqlite3/sqlite não estiverem instalados localmente
declare module 'sqlite3' {
  const sqlite3: any;
  export = sqlite3;
}

declare module 'sqlite' {
  export function open(opts: any): Promise<any>;
}
