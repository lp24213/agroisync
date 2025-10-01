// Silenciar logs em produção sem afetar desenvolvimento
/* eslint-disable no-console */
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop; // manter apenas errors visíveis
}
/* eslint-enable no-console */


