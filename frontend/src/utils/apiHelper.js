/**
 * 🔧 API HELPER
 * Helper para garantir que todas as chamadas de API usem a URL correta
 */

/**
 * Retorna a URL base da API
 * Prioriza variável de ambiente, fallback para produção
 */
export const getApiUrl = (endpoint = '') => {
  const baseUrl = process.env.REACT_APP_API_URL || '/api';
  
  // Remover barras iniciais e finais
  const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  
  // Se endpoint JÁ começa com 'api/', usar direto
  if (cleanEndpoint.startsWith('api/')) {
    return `${baseUrl.replace('/api', '')}/${cleanEndpoint}`;
  }
  
  // Se endpoint está vazio ou é só 'api', retornar base
  if (!cleanEndpoint || cleanEndpoint === 'api') {
    return baseUrl;
  }
  
  // Caso padrão: adicionar endpoint ao base
  return `${baseUrl}/${cleanEndpoint}`;
};

/**
 * Faz uma requisição autenticada
 * @param {String} endpoint - Endpoint da API (ex: 'user/profile')
 * @param {Object} options - Opções do fetch
 * @returns {Promise<Response>}
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const url = getApiUrl(endpoint);
  
  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  return fetch(url, mergedOptions);
};

/**
 * GET request autenticado
 */
export const apiGet = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'GET' });
  return response.json();
};

/**
 * POST request autenticado
 */
export const apiPost = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};

/**
 * PUT request autenticado
 */
export const apiPut = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.json();
};

/**
 * DELETE request autenticado
 */
export const apiDelete = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'DELETE' });
  return response.json();
};

export default {
  getApiUrl,
  apiFetch,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};

