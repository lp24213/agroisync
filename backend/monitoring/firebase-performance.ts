/**
 * Monitoring - Firebase Performance
 * 
 * Este módulo implementa a integração com o Firebase Performance Monitoring
 * para rastrear métricas de performance da aplicação AGROTM.
 * 
 * Funcionalidades:
 * - Rastreamento de tempo de carregamento de página
 * - Métricas de API e requisições de rede
 * - Métricas de renderização e interação do usuário
 * - Rastreamento de performance de transações blockchain
 * - Métricas personalizadas para operações críticas
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getPerformance, trace, Trace, PerformanceObserver } from 'firebase/performance';
import { Connection } from '@solana/web3.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase (se ainda não estiver inicializado)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializar Performance Monitoring (apenas no cliente)
let performance: any = null;
let isInitialized = false;

// Mapa de traces ativos
const activeTraces: Map<string, Trace> = new Map();

// Conexão Solana para monitoramento de transações
let solanaConnection: Connection | null = null;

/**
 * Inicializa o Firebase Performance Monitoring
 * @returns {boolean} Indica se a inicialização foi bem-sucedida
 */
export function initFirebasePerformance(): boolean {
  // Verificar se está no lado do cliente
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Evitar inicialização duplicada
    if (isInitialized) {
      return true;
    }

    // Inicializar Performance Monitoring
    performance = getPerformance(app);
    isInitialized = true;

    // Configurar observador de performance para métricas da Web Vitals
    setupPerformanceObserver();

    // Configurar monitoramento de rede
    setupNetworkMonitoring();

    // Inicializar conexão Solana se estiver configurada
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      solanaConnection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
    }

    console.log('Firebase Performance Monitoring inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar Firebase Performance:', error);
    return false;
  }
}

/**
 * Configura o observador de performance para métricas da Web Vitals
 */
function setupPerformanceObserver() {
  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    // Observar métricas de LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          const customTrace = startTrace('web_vitals_lcp');
          customTrace.putMetric('lcp_value', entry.startTime);
          stopTrace(customTrace);
        }
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Observar métricas de FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'first-input') {
          const customTrace = startTrace('web_vitals_fid');
          customTrace.putMetric('fid_value', entry.processingStart - entry.startTime);
          stopTrace(customTrace);
        }
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Observar métricas de CLS (Cumulative Layout Shift)
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const customTrace = startTrace('web_vitals_cls');
      customTrace.putMetric('cls_value', clsValue * 1000); // Multiplicar por 1000 para melhor precisão
      stopTrace(customTrace);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Observar métricas de navegação
    const navigationObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === 'navigation') {
          const customTrace = startTrace('page_load_metrics');
          customTrace.putMetric('dns_time', entry.domainLookupEnd - entry.domainLookupStart);
          customTrace.putMetric('connect_time', entry.connectEnd - entry.connectStart);
          customTrace.putMetric('ttfb', entry.responseStart - entry.requestStart);
          customTrace.putMetric('dom_load_time', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
          customTrace.putMetric('dom_ready_time', entry.domContentLoadedEventEnd - entry.navigationStart);
          customTrace.putMetric('page_load_time', entry.loadEventEnd - entry.navigationStart);
          stopTrace(customTrace);
        }
      });
    });
    navigationObserver.observe({ type: 'navigation', buffered: true });

    // Observar métricas de recursos
    const resourceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (entry.entryType === 'resource') {
          // Filtrar apenas recursos importantes (JS, CSS, imagens, fontes)
          const resourceType = getResourceType(entry.name);
          if (resourceType) {
            const customTrace = startTrace(`resource_${resourceType}`);
            customTrace.putMetric('resource_size', entry.transferSize || 0);
            customTrace.putMetric('resource_load_time', entry.responseEnd - entry.startTime);
            customTrace.setAttribute('resource_url', entry.name);
            stopTrace(customTrace);
          }
        }
      });
    });
    resourceObserver.observe({ type: 'resource', buffered: true });
  } catch (error) {
    console.error('Erro ao configurar observadores de performance:', error);
  }
}

/**
 * Determina o tipo de recurso com base na URL
 * @param {string} url URL do recurso
 * @returns {string|null} Tipo do recurso ou null se não for importante
 */
function getResourceType(url: string): string | null {
  if (url.endsWith('.js')) return 'js';
  if (url.endsWith('.css')) return 'css';
  if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url)) return 'image';
  if (/\.(woff|woff2|ttf|otf|eot)$/i.test(url)) return 'font';
  if (url.includes('/api/')) return 'api';
  if (url.includes('graphql')) return 'graphql';
  return null;
}

/**
 * Configura monitoramento de requisições de rede
 */
function setupNetworkMonitoring() {
  if (typeof window === 'undefined' || !window.fetch) {
    return;
  }

  try {
    // Interceptar chamadas fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const traceName = `network_${getAPIEndpointName(url)}`;
      const networkTrace = startTrace(traceName);
      
      try {
        const response = await originalFetch(input, init);
        networkTrace.putMetric('status_code', response.status);
        networkTrace.putMetric('response_size', parseInt(response.headers.get('content-length') || '0', 10));
        networkTrace.setAttribute('url', url);
        stopTrace(networkTrace);
        return response;
      } catch (error) {
        networkTrace.putMetric('error', 1);
        networkTrace.setAttribute('error_message', error instanceof Error ? error.message : 'Unknown error');
        stopTrace(networkTrace);
        throw error;
      }
    };

    // Interceptar XMLHttpRequest se necessário
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._perfUrl = url;
      this._perfMethod = method;
      return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
      if (this._perfUrl) {
        const traceName = `xhr_${getAPIEndpointName(this._perfUrl)}`;
        const xhrTrace = startTrace(traceName);
        
        this.addEventListener('load', () => {
          xhrTrace.putMetric('status_code', this.status);
          xhrTrace.putMetric('response_size', parseInt(this.getResponseHeader('content-length') || '0', 10));
          xhrTrace.setAttribute('url', this._perfUrl);
          xhrTrace.setAttribute('method', this._perfMethod);
          stopTrace(xhrTrace);
        });

        this.addEventListener('error', () => {
          xhrTrace.putMetric('error', 1);
          xhrTrace.setAttribute('url', this._perfUrl);
          xhrTrace.setAttribute('method', this._perfMethod);
          stopTrace(xhrTrace);
        });
      }

      return originalXHRSend.apply(this, args);
    };
  } catch (error) {
    console.error('Erro ao configurar monitoramento de rede:', error);
  }
}

/**
 * Extrai o nome do endpoint da API a partir da URL
 * @param {string} url URL da requisição
 * @returns {string} Nome do endpoint para uso no trace
 */
function getAPIEndpointName(url: string): string {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    const pathname = parsedUrl.pathname;
    
    // Verificar se é uma API interna
    if (pathname.startsWith('/api/')) {
      // Extrair até o segundo nível do caminho da API
      const parts = pathname.split('/');
      if (parts.length >= 3) {
        return `api_${parts[2]}`;
      }
      return 'api_call';
    }
    
    // Para URLs externas, usar o hostname
    return `ext_${parsedUrl.hostname.replace(/\./g, '_')}`;
  } catch (error) {
    return 'unknown_api';
  }
}

/**
 * Inicia um trace personalizado
 * @param {string} traceName Nome do trace
 * @returns {Trace} Objeto do trace
 */
export function startTrace(traceName: string): Trace {
  if (!isInitialized) {
    initFirebasePerformance();
  }

  if (!performance) {
    throw new Error('Firebase Performance não está inicializado');
  }

  try {
    const newTrace = trace(performance, traceName);
    newTrace.start();
    activeTraces.set(traceName, newTrace);
    return newTrace;
  } catch (error) {
    console.error(`Erro ao iniciar trace ${traceName}:`, error);
    throw error;
  }
}

/**
 * Para um trace em andamento
 * @param {Trace|string} traceOrName Objeto do trace ou nome do trace
 */
export function stopTrace(traceOrName: Trace | string): void {
  try {
    let currentTrace: Trace | undefined;

    if (typeof traceOrName === 'string') {
      currentTrace = activeTraces.get(traceOrName);
      if (!currentTrace) {
        console.warn(`Trace ${traceOrName} não encontrado para parar`);
        return;
      }
    } else {
      currentTrace = traceOrName;
      // Encontrar e remover do mapa de traces ativos
      for (const [name, trace] of activeTraces.entries()) {
        if (trace === currentTrace) {
          activeTraces.delete(name);
          break;
        }
      }
    }

    currentTrace.stop();
  } catch (error) {
    console.error('Erro ao parar trace:', error);
  }
}

/**
 * Adiciona uma métrica personalizada a um trace
 * @param {string} traceName Nome do trace
 * @param {string} metricName Nome da métrica
 * @param {number} value Valor da métrica
 */
export function addTraceMetric(traceName: string, metricName: string, value: number): void {
  try {
    const currentTrace = activeTraces.get(traceName);
    if (!currentTrace) {
      console.warn(`Trace ${traceName} não encontrado para adicionar métrica`);
      return;
    }

    currentTrace.putMetric(metricName, value);
  } catch (error) {
    console.error(`Erro ao adicionar métrica ${metricName} ao trace ${traceName}:`, error);
  }
}

/**
 * Adiciona um atributo personalizado a um trace
 * @param {string} traceName Nome do trace
 * @param {string} attributeName Nome do atributo
 * @param {string} value Valor do atributo
 */
export function addTraceAttribute(traceName: string, attributeName: string, value: string): void {
  try {
    const currentTrace = activeTraces.get(traceName);
    if (!currentTrace) {
      console.warn(`Trace ${traceName} não encontrado para adicionar atributo`);
      return;
    }

    currentTrace.putAttribute(attributeName, value);
  } catch (error) {
    console.error(`Erro ao adicionar atributo ${attributeName} ao trace ${traceName}:`, error);
  }
}

/**
 * Rastreia o tempo de carregamento de uma página específica
 * @param {string} pageName Nome da página
 */
export function trackPageLoad(pageName: string): void {
  try {
    const pageTrace = startTrace(`page_load_${pageName}`);
    
    // Capturar métricas quando a página estiver totalmente carregada
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        
        pageTrace.putMetric('dns_time', timing.domainLookupEnd - timing.domainLookupStart);
        pageTrace.putMetric('connect_time', timing.connectEnd - timing.connectStart);
        pageTrace.putMetric('ttfb', timing.responseStart - timing.requestStart);
        pageTrace.putMetric('dom_load_time', timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart);
        pageTrace.putMetric('dom_ready_time', timing.domContentLoadedEventEnd - timing.navigationStart);
        pageTrace.putMetric('page_load_time', timing.loadEventEnd - timing.navigationStart);
        
        stopTrace(pageTrace);
      }
    });
  } catch (error) {
    console.error(`Erro ao rastrear carregamento da página ${pageName}:`, error);
  }
}

/**
 * Rastreia o tempo de execução de uma transação blockchain
 * @param {string} txType Tipo de transação
 * @param {string} txHash Hash da transação
 * @returns {Trace} Objeto do trace para ser parado após a conclusão
 */
export function trackBlockchainTransaction(txType: string, txHash: string): Trace {
  try {
    const txTrace = startTrace(`blockchain_tx_${txType}`);
    txTrace.putAttribute('tx_hash', txHash);
    txTrace.putAttribute('tx_type', txType);
    
    // Se temos uma conexão Solana, podemos monitorar a confirmação
    if (solanaConnection) {
      const startTime = Date.now();
      solanaConnection.confirmTransaction(txHash)
        .then((confirmation) => {
          const endTime = Date.now();
          txTrace.putMetric('confirmation_time', endTime - startTime);
          txTrace.putAttribute('confirmation_status', 'success');
          stopTrace(txTrace);
        })
        .catch((error) => {
          txTrace.putAttribute('error', error.message);
          txTrace.putAttribute('confirmation_status', 'failed');
          stopTrace(txTrace);
        });
    }
    
    return txTrace;
  } catch (error) {
    console.error(`Erro ao rastrear transação blockchain ${txType}:`, error);
    throw error;
  }
}

/**
 * Rastreia o tempo de execução de uma função
 * @param {string} functionName Nome da função
 * @param {Function} fn Função a ser executada
 * @param {any[]} args Argumentos da função
 * @returns {Promise<any>} Resultado da função
 */
export async function trackFunction<T>(functionName: string, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
  const functionTrace = startTrace(`function_${functionName}`);
  
  try {
    const result = await fn(...args);
    functionTrace.putAttribute('status', 'success');
    return result;
  } catch (error) {
    functionTrace.putAttribute('status', 'error');
    functionTrace.putAttribute('error_message', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  } finally {
    stopTrace(functionTrace);
  }
}

/**
 * Rastreia o tempo de renderização de um componente React
 * @param {string} componentName Nome do componente
 * @returns {Object} Objeto com métodos start e end para rastrear o ciclo de vida
 */
export function trackComponentRender(componentName: string) {
  let renderTrace: Trace | null = null;
  
  return {
    start: () => {
      renderTrace = startTrace(`component_render_${componentName}`);
    },
    end: () => {
      if (renderTrace) {
        stopTrace(renderTrace);
        renderTrace = null;
      }
    }
  };
}

/**
 * Rastreia métricas de interação do usuário
 * @param {string} interactionType Tipo de interação (click, scroll, etc)
 * @param {string} elementId ID ou descrição do elemento
 */
export function trackUserInteraction(interactionType: string, elementId: string): void {
  try {
    const interactionTrace = startTrace(`user_interaction_${interactionType}`);
    interactionTrace.putAttribute('element_id', elementId);
    interactionTrace.putAttribute('interaction_type', interactionType);
    interactionTrace.putAttribute('timestamp', new Date().toISOString());
    
    // Parar o trace após um curto período
    setTimeout(() => {
      stopTrace(interactionTrace);
    }, 100);
  } catch (error) {
    console.error(`Erro ao rastrear interação do usuário ${interactionType}:`, error);
  }
}

/**
 * Rastreia métricas de staking
 * @param {string} action Ação de staking (deposit, withdraw, claim)
 * @param {string} poolId ID do pool
 * @param {number} amount Quantidade envolvida
 * @returns {Trace} Objeto do trace para ser parado após a conclusão
 */
export function trackStakingAction(action: string, poolId: string, amount: number): Trace {
  try {
    const stakingTrace = startTrace(`staking_${action}`);
    stakingTrace.putAttribute('pool_id', poolId);
    stakingTrace.putAttribute('action', action);
    stakingTrace.putMetric('amount', amount);
    stakingTrace.putAttribute('timestamp', new Date().toISOString());
    
    return stakingTrace;
  } catch (error) {
    console.error(`Erro ao rastrear ação de staking ${action}:`, error);
    throw error;
  }
}

/**
 * Rastreia métricas de NFT
 * @param {string} action Ação relacionada a NFT (mint, transfer, list, buy)
 * @param {string} tokenId ID do token
 * @returns {Trace} Objeto do trace para ser parado após a conclusão
 */
export function trackNFTAction(action: string, tokenId: string): Trace {
  try {
    const nftTrace = startTrace(`nft_${action}`);
    nftTrace.putAttribute('token_id', tokenId);
    nftTrace.putAttribute('action', action);
    nftTrace.putAttribute('timestamp', new Date().toISOString());
    
    return nftTrace;
  } catch (error) {
    console.error(`Erro ao rastrear ação de NFT ${action}:`, error);
    throw error;
  }
}

// Exportar funções e tipos
export default {
  initFirebasePerformance,
  startTrace,
  stopTrace,
  addTraceMetric,
  addTraceAttribute,
  trackPageLoad,
  trackBlockchainTransaction,
  trackFunction,
  trackComponentRender,
  trackUserInteraction,
  trackStakingAction,
  trackNFTAction,
};