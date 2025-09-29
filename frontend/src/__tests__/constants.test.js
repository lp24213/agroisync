/**
 * Testes para constants.js (configurações centralizadas)
 */

import {
  API_CONFIG,
  AUTH_CONFIG,
  STRIPE_CONFIG,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isProduction,
  isDevelopment,
  getApiUrl
} from '../config/constants';

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

describe('Constants Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('API_CONFIG', () => {
    it('deve ter baseURL definida', () => {
      expect(API_CONFIG).toHaveProperty('baseURL');
      expect(typeof API_CONFIG.baseURL).toBe('string');
    });

    it('deve ter timeout configurado', () => {
      expect(API_CONFIG).toHaveProperty('timeout');
      expect(typeof API_CONFIG.timeout).toBe('number');
      expect(API_CONFIG.timeout).toBeGreaterThan(0);
    });

    it('deve ter headers padrão', () => {
      expect(API_CONFIG).toHaveProperty('headers');
      expect(API_CONFIG.headers).toHaveProperty('Content-Type');
      expect(API_CONFIG.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('AUTH_CONFIG', () => {
    it('deve ter tokenKey definida', () => {
      expect(AUTH_CONFIG).toHaveProperty('tokenKey');
      expect(AUTH_CONFIG.tokenKey).toBe('authToken');
    });

    it('deve ter userKey definida', () => {
      expect(AUTH_CONFIG).toHaveProperty('userKey');
      expect(AUTH_CONFIG.userKey).toBe('user');
    });
  });

  describe('getAuthToken', () => {
    it('deve retornar null quando não há token', () => {
      const token = getAuthToken();
      expect(token).toBeNull();
    });

    it('deve retornar o token quando existe', () => {
      localStorage.setItem('authToken', 'meu-token-123');
      const token = getAuthToken();
      expect(token).toBe('meu-token-123');
    });

    it('deve ter fallback para "token" (compatibilidade)', () => {
      localStorage.setItem('token', 'token-antigo');
      const token = getAuthToken();
      expect(token).toBe('token-antigo');
    });
  });

  describe('setAuthToken', () => {
    it('deve salvar o token no localStorage', () => {
      setAuthToken('novo-token');
      expect(localStorage.getItem('authToken')).toBe('novo-token');
    });

    it('deve salvar em ambos os lugares (compatibilidade)', () => {
      setAuthToken('novo-token');
      expect(localStorage.getItem('authToken')).toBe('novo-token');
      expect(localStorage.getItem('token')).toBe('novo-token');
    });
  });

  describe('removeAuthToken', () => {
    it('deve remover o token do localStorage', () => {
      localStorage.setItem('authToken', 'token-para-remover');
      localStorage.setItem('user', '{"name":"Test"}');

      removeAuthToken();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('deve remover ambos os tokens (compatibilidade)', () => {
      localStorage.setItem('authToken', 'token1');
      localStorage.setItem('token', 'token2');

      removeAuthToken();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('getApiUrl', () => {
    it('deve retornar URL completa com path', () => {
      const url = getApiUrl('/users');
      expect(url).toContain('/users');
    });

    it('deve adicionar "/" se path não começar com /', () => {
      const url = getApiUrl('users');
      expect(url).toContain('/users');
    });
  });

  describe('Environment checks', () => {
    it('isProduction deve retornar boolean', () => {
      expect(typeof isProduction()).toBe('boolean');
    });

    it('isDevelopment deve retornar boolean', () => {
      expect(typeof isDevelopment()).toBe('boolean');
    });
  });

  describe('STRIPE_CONFIG', () => {
    it('deve ter publishableKey', () => {
      expect(STRIPE_CONFIG).toHaveProperty('publishableKey');
    });

    it('deve ter plans configurados', () => {
      expect(STRIPE_CONFIG).toHaveProperty('plans');
      expect(STRIPE_CONFIG.plans).toHaveProperty('basic');
      expect(STRIPE_CONFIG.plans).toHaveProperty('professional');
      expect(STRIPE_CONFIG.plans).toHaveProperty('enterprise');
    });
  });
});
