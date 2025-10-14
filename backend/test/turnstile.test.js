// @ts-check
import { verifyTurnstileToken, getTurnstileConfig, validateTurnstile } from '../src/utils/turnstile.js';

describe('Turnstile Validation', () => {
  const mockEnv = {
    CF_TURNSTILE_SITE_KEY: 'test-site-key',
    CF_TURNSTILE_SECRET_KEY: 'test-secret-key'
  };

  // Mock fetch para testes
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true })
    })
  );

  beforeEach(() => {
    fetch.mockClear();
  });

  test('getTurnstileConfig retorna configuração correta', () => {
    const config = getTurnstileConfig(mockEnv);
    expect(config.siteKey).toBe('test-site-key');
    expect(config.secretKey).toBe('test-secret-key');
  });

  test('verifyTurnstileToken valida token corretamente', async () => {
    const valid = await verifyTurnstileToken('test-token', mockEnv);
    expect(valid).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('test-token')
      })
    );
  });

  test('validateTurnstile rejeita requisições sem token', async () => {
    const request = new Request('https://test.com', {
      method: 'POST'
    });

    const response = await validateTurnstile(request, mockEnv);
    expect(response.status).toBe(403);
  });

  test('validateTurnstile aceita requisições com token válido', async () => {
    const request = new Request('https://test.com', {
      method: 'POST',
      headers: {
        'CF-Turnstile-Token': 'valid-token'
      }
    });

    const response = await validateTurnstile(request, mockEnv);
    expect(response).toBeNull();
  });
});