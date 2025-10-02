/**
 * AGROISYNC - Development Tools
 *
 * Utilitários úteis apenas para desenvolvimento.
 * Automaticamente desabilitados em produção.
 *
 * IMPORTANTE: Este arquivo NÃO afeta o código em produção.
 */

import React, { useEffect, useRef } from 'react';
import { isDevelopment } from '../config/constants.js';

/**
 * Logger de desenvolvimento com cores e categorias
 */
export const devLog = {
  /**
   * Log informativo
   */
  info: (...args) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[INFO]', 'color: #3b82f6; font-weight: bold', ...args);

      }
    }
  },

  /**
   * Log de sucesso
   */
  success: (...args) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[SUCCESS]', 'color: #10b981; font-weight: bold', ...args);

      }
    }
  },

  /**
   * Log de aviso
   */
  warn: (...args) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.warn('%c[WARNING]', 'color: #f59e0b; font-weight: bold', ...args);

      }
    }
  },

  /**
   * Log de erro
   */
  error: (...args) => {
    if (isDevelopment()) {
      console.error('%c[ERROR]', 'color: #ef4444; font-weight: bold', ...args);
    }
  },

  /**
   * Log de API call
   */
  api: (method, url, data = null) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[API]', 'color: #8b5cf6; font-weight: bold', `${method} ${url}`, data ? data : '');

      }
    }
  },

  /**
   * Log de render de componente
   */
  render: (componentName, props = null) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[RENDER]', 'color: #06b6d4; font-weight: bold', componentName, props ? props : '');

      }
    }
  },

  /**
   * Log de estado
   */
  state: (label, value) => {
    if (isDevelopment()) {
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[STATE]', 'color: #ec4899; font-weight: bold', label, value);

      }
    }
  },

  /**
   * Log com grupo colapsável
   */
  group: (label, callback) => {
    if (isDevelopment()) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  /**
   * Log com tabela
   */
  table: data => {
    if (isDevelopment()) {
      console.table(data);
    }
  }
};

/**
 * Timer de performance para medir execução
 *
 * Exemplo:
 * const timer = perfTimer('fetchData');
 * await fetchData();
 * timer.end(); // Logs: fetchData took 250ms
 */
export const perfTimer = label => {
  if (!isDevelopment()) {
    return { end: () => {} };
  }

  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      if (process.env.NODE_ENV !== 'production') {

        console.log('%c[PERF]', 'color: #14b8a6; font-weight: bold', `${label} took ${duration.toFixed(2);

      }}ms`);
      return duration;
    }
  };
};

/**
 * Wrapper para componentes React com logging automático
 *
 * Exemplo:
 * export default withDevLogging(MyComponent, 'MyComponent');
 */
export const withDevLogging = (Component, componentName) => {
  if (!isDevelopment()) {
    return Component;
  }

  return props => {
    const timer = perfTimer(`Render ${componentName}`);

    useEffect(() => {
      devLog.render(componentName, props);
    }, [props]);

    const result = Component(props);
    timer.end();

    return result;
  };
};

/**
 * Hook para debug de props mudando
 *
 * Exemplo:
 * useWhyDidYouUpdate('MyComponent', props);
 */
export const useWhyDidYouUpdate = (name, props) => {
  if (!isDevelopment()) return;

  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        devLog.group(`[WHY-UPDATE] ${name}`, () => {
          if (process.env.NODE_ENV !== 'production') {

            console.log('Changed props:', changedProps);

          }
        });
      }
    }

    previousProps.current = props;
  });
};

/**
 * Hook para debug de renders
 */
export const useRenderCount = componentName => {
  if (!isDevelopment()) return;

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    devLog.info(`${componentName} rendered ${renderCount.current} times`);
  });
};

/**
 * Mostra informações da build no console
 */
export const showBuildInfo = () => {
  if (!isDevelopment()) return;

  console.log(
    '%c🌾 AGROISYNC - Development Mode',
    'color: #10b981; font-size: 16px; font-weight: bold; padding: 10px;'
  );

  console.table({
    Environment: process.env.NODE_ENV,
    'React Version': React.version,
    'API URL': process.env.REACT_APP_API_URL || 'Not configured',
    Timestamp: new Date().toISOString()
  });
};

/**
 * Mock data generator para testes
 */
export const mockData = {
  /**
   * Gera usuário fake
   */
  user: (overrides = {}) => ({
    id: Math.random().toString(36).substring(7),
    name: 'João da Silva',
    email: 'joao@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  /**
   * Gera produto fake
   */
  product: (overrides = {}) => ({
    id: Math.random().toString(36).substring(7),
    name: 'Produto Teste',
    description: 'Descrição do produto teste',
    price: 99.9,
    category: 'graos',
    stock: 100,
    ...overrides
  }),

  /**
   * Gera lista de items
   */
  list: (generator, count = 5) => {
    return Array.from({ length: count }, () => generator());
  },

  /**
   * Gera resposta de API fake
   */
  apiResponse: (data, overrides = {}) => ({
    success: true,
    message: 'Success',
    data,
    timestamp: Date.now(),
    ...overrides
  })
};

/**
 * Helpers para testar estados de loading/error
 */
export const testStates = {
  /**
   * Simula delay de API
   */
  delay: (ms = 1000) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Simula erro de API
   */
  throwError: (message = 'Test error') => {
    throw new Error(message);
  },

  /**
   * Simula resposta de API com delay
   */
  mockApiCall: async (data, delay = 500, shouldFail = false) => {
    await testStates.delay(delay);

    if (shouldFail) {
      throw new Error('API call failed');
    }

    return mockData.apiResponse(data);
  }
};

/**
 * Debugger de estado do Redux/Zustand
 */
export const stateDebugger = {
  /**
   * Loga todas as mudanças de estado
   */
  logStateChanges: (storeName, oldState, newState) => {
    if (!isDevelopment()) return;

    devLog.group(`[STATE CHANGE] ${storeName}`, () => {
      if (process.env.NODE_ENV !== 'production') {

        console.log('Previous:', oldState);

      }
      if (process.env.NODE_ENV !== 'production') {

        console.log('Current:', newState);

      }
      console.log('Changed:', {
        ...Object.keys(newState).reduce((acc, key) => {
          if (oldState[key] !== newState[key]) {
            acc[key] = { from: oldState[key], to: newState[key] };
          }
          return acc;
        }, {})
      });
    });
  }
};

/**
 * Validador de PropTypes em runtime (para desenvolvimento)
 */
export const validateProps = (props, schema, componentName) => {
  if (!isDevelopment()) return;

  Object.keys(schema).forEach(key => {
    const expectedType = schema[key];
    const actualValue = props[key];
    const actualType = typeof actualValue;

    if (expectedType.required && actualValue === undefined) {
      devLog.error(`${componentName}: Missing required prop '${key}'`);
    }

    if (actualValue !== undefined && actualType !== expectedType.type) {
      devLog.error(`${componentName}: Invalid prop '${key}'. Expected ${expectedType.type}, got ${actualType}`);
    }
  });
};

/**
 * Exporta estado para JSON (útil para debugging)
 */
export const exportStateToJson = (state, filename = 'state-export.json') => {
  if (!isDevelopment()) return;

  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
  devLog.success(`State exported to ${filename}`);
};

/**
 * Mostra todas as variáveis de ambiente
 */
export const showEnvVars = () => {
  if (!isDevelopment()) return;

  const envVars = Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((acc, key) => {
      acc[key] = process.env[key];
      return acc;
    }, {});

  devLog.group('Environment Variables', () => {
    console.table(envVars);
  });
};

/**
 * Adiciona atalhos de teclado para desenvolvimento
 */
export const enableDevShortcuts = () => {
  if (!isDevelopment()) return;

  document.addEventListener('keydown', e => {
    // Ctrl/Cmd + Shift + D = Show dev tools
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      showBuildInfo();
      showEnvVars();
    }

    // Ctrl/Cmd + Shift + L = Clear console
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      console.clear();
      devLog.success('Console cleared');
    }

    // Ctrl/Cmd + Shift + E = Export state
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      devLog.info('State export - implement in your component');
    }
  });

  devLog.info('Dev shortcuts enabled:');
  devLog.info('  Ctrl+Shift+D: Show dev info');
  devLog.info('  Ctrl+Shift+L: Clear console');
  devLog.info('  Ctrl+Shift+E: Export state');
};

// Inicializar automaticamente em desenvolvimento
if (isDevelopment()) {
  // Mostrar info de build ao carregar
  showBuildInfo();

  // Habilitar atalhos
  if (typeof window !== 'undefined') {
    enableDevShortcuts();
  }
}

// Exportar tudo como default também
export default {
  devLog,
  perfTimer,
  withDevLogging,
  useWhyDidYouUpdate,
  useRenderCount,
  showBuildInfo,
  mockData,
  testStates,
  stateDebugger,
  validateProps,
  exportStateToJson,
  showEnvVars,
  enableDevShortcuts
};
