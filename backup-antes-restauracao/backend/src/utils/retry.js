// @ts-check

/**
 * Configuração para retry com backoff exponencial
 * @typedef {Object} RetryConfig
 * @property {number} maxAttempts - Número máximo de tentativas
 * @property {number} delayMs - Delay inicial em milissegundos
 * @property {boolean} exponential - Se deve usar backoff exponencial
 * @property {function} onError - Callback chamado em cada erro
 */

/**
 * Executa uma função com retry e backoff exponencial
 * @param {function} fn - Função a ser executada
 * @param {RetryConfig} config - Configuração do retry
 * @returns {Promise<any>} - Resultado da função
 */
export async function retryWithBackoff(fn, config) {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    exponential = true,
    onError = () => {}
  } = config;

  let attempt = 1;
  let lastError;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      onError(error, attempt);

      if (attempt === maxAttempts) {
        break;
      }

      const delay = exponential ? delayMs * Math.pow(2, attempt - 1) : delayMs;
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw new Error(`Todas as ${maxAttempts} tentativas falharam. Último erro: ${lastError.message}`);
}

/**
 * Wrapper para executar uma função com timeout
 * @param {Promise} promise - Promise a ser executada
 * @param {number} timeoutMs - Timeout em milissegundos
 * @param {string} errorMessage - Mensagem de erro customizada
 * @returns {Promise<any>} - Resultado da promise ou erro de timeout
 */
export function withTimeout(promise, timeoutMs, errorMessage = 'Operação excedeu o tempo limite') {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Decorator para adicionar retry a qualquer método de classe
 * @param {RetryConfig} config - Configuração do retry
 * @returns {Function} - Decorator function
 */
export function withRetry(config = {}) {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      return retryWithBackoff(
        () => originalMethod.apply(this, args),
        config
      );
    };

    return descriptor;
  };
}