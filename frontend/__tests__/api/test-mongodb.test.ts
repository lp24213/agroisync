import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/test-mongodb';

describe('API /api/test-mongodb', () => {
  it('deve retornar status ok se conectado ao MongoDB', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.collections).toBeDefined();
  });
});
