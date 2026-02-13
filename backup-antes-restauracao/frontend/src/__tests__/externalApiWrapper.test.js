/**
 * Testes para External API Wrapper
 */

import externalApiWrapper from '../services/externalApiWrapper';

describe('External API Wrapper', () => {
  beforeEach(() => {
    // Limpar cache antes de cada teste
    externalApiWrapper.clearCache();
  });

  describe('Cache management', () => {
    it('deve salvar dados no cache', () => {
      const key = 'test-key';
      const data = { test: 'data' };
      const duration = 1000;

      externalApiWrapper.saveToCache(key, data, duration);
      const cached = externalApiWrapper.getFromCache(key);

      expect(cached).toEqual(data);
    });

    it('deve retornar null para chave inexistente', () => {
      const cached = externalApiWrapper.getFromCache('chave-inexistente');
      expect(cached).toBeNull();
    });

    it('deve expirar cache após duração', async () => {
      const key = 'test-key';
      const data = { test: 'data' };
      const duration = 10; // 10ms

      externalApiWrapper.saveToCache(key, data, duration);

      // Esperar expirar
      await new Promise(resolve => setTimeout(resolve, 20));

      const cached = externalApiWrapper.getFromCache(key);
      expect(cached).toBeNull();
    });

    it('deve limpar cache específico', () => {
      externalApiWrapper.saveToCache('key1', 'data1', 1000);
      externalApiWrapper.saveToCache('key2', 'data2', 1000);

      externalApiWrapper.clearCache('key1');

      expect(externalApiWrapper.getFromCache('key1')).toBeNull();
      expect(externalApiWrapper.getFromCache('key2')).toBe('data2');
    });

    it('deve limpar todo o cache', () => {
      externalApiWrapper.saveToCache('key1', 'data1', 1000);
      externalApiWrapper.saveToCache('key2', 'data2', 1000);

      externalApiWrapper.clearCache();

      expect(externalApiWrapper.getFromCache('key1')).toBeNull();
      expect(externalApiWrapper.getFromCache('key2')).toBeNull();
    });
  });

  describe('Mock data fallbacks', () => {
    it('deve retornar mock de CEP', () => {
      const result = externalApiWrapper.fetchCEP('01310100');
      expect(result).toBeDefined();
    });

    it('deve validar formato de CEP', async () => {
      const result = await externalApiWrapper.fetchCEP('123'); // CEP inválido
      expect(result.success).toBe(false);
      expect(result.error).toContain('inválido');
    });

    it('deve ter mock de weather', () => {
      const mock = externalApiWrapper.getWeatherMockData('São Paulo');
      expect(mock).toHaveProperty('success');
      expect(mock).toHaveProperty('data');
      expect(mock.data).toHaveProperty('main');
      expect(mock.data.main).toHaveProperty('temp');
    });

    it('deve ter mock de stock', () => {
      const mock = externalApiWrapper.getStockMockData('SOJA');
      expect(mock).toHaveProperty('success');
      expect(mock).toHaveProperty('data');
      expect(mock.data).toHaveProperty('Global Quote');
    });
  });

  describe('Helper methods', () => {
    it('sleep deve esperar o tempo correto', async () => {
      const start = Date.now();
      await externalApiWrapper.sleep(100);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(90); // margem de 10ms
      expect(elapsed).toBeLessThan(150);
    });
  });
});
