/**
 * Testes para CSRF Protection
 */

import { generateCSRFToken, validateCSRFToken } from '../middleware/csrf.js';

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('deve gerar um token CSRF válido', () => {
      const req = { ip: '127.0.0.1' };
      const token = generateCSRFToken(req);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes em hex = 64 caracteres
    });

    it('deve gerar tokens diferentes em cada chamada', () => {
      const req = { ip: '127.0.0.1' };
      const token1 = generateCSRFToken(req);
      const token2 = generateCSRFToken(req);

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateCSRFToken', () => {
    it('deve validar um token recém criado', () => {
      const req = { ip: '127.0.0.1' };
      const token = generateCSRFToken(req);

      const isValid = validateCSRFToken(req, token);
      expect(isValid).toBe(true);
    });

    it('deve rejeitar token inválido', () => {
      const req = { ip: '127.0.0.1' };
      const isValid = validateCSRFToken(req, 'token-invalido');

      expect(isValid).toBe(false);
    });

    it('deve rejeitar token vazio', () => {
      const req = { ip: '127.0.0.1' };
      const isValid = validateCSRFToken(req, '');

      expect(isValid).toBe(false);
    });

    it('deve rejeitar token de outra sessão', () => {
      const req1 = { ip: '127.0.0.1' };
      const req2 = { ip: '192.168.1.1' };
      const token = generateCSRFToken(req1);

      const isValid = validateCSRFToken(req2, token);
      expect(isValid).toBe(false);
    });
  });
});
