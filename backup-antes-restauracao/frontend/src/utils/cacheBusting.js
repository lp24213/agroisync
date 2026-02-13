// Cache Busting para Assets
// Este arquivo força o navegador a recarregar os assets atualizados

const CACHE_VERSION = '1.0.1';
const ASSETS_TO_BUST = [
  '/assets/LOGOTIPO-EM-BRANCO.png',
  '/assets/inicio.png',
  '/assets/marketplace.png',
  '/assets/agroconecta.png',
  '/assets/parceria.png'
];

// Função para adicionar timestamp aos assets
export function getAssetWithCacheBust(assetPath) {
  return `${assetPath}?v=${CACHE_VERSION}&t=${Date.now()}`;
}

// Função para limpar cache do navegador
export function clearBrowserCache() {
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }

  // Limpar localStorage relacionado a assets
  Object.keys(localStorage).forEach(key => {
    if (key.includes('asset') || key.includes('image')) {
      localStorage.removeItem(key);
    }
  });
}

// Auto-executar limpeza de cache
if (typeof window !== 'undefined') {
  clearBrowserCache();
}
