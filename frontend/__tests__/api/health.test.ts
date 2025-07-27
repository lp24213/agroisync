import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/health';

describe('API /api/health', () => {
  it('deve retornar status ok ou degraded', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    const data = res._getJSONData();
    expect(['ok', 'degraded']).toContain(data.status);
    expect(data.services).toBeDefined();
    expect(data.env).toBeDefined();
    expect(data.latency_ms).toBeGreaterThanOrEqual(0);
  });
});
