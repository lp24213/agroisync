process.env.USE_D1 = 'true';
process.env.NODE_ENV = 'development';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agroisync_test';

const handler = require('../backend/src/lambdas/products/products.js').handler;

async function run() {
  console.log('Running products lambda PoC tests (D1 enabled)');

  // Test GET /products/public
  const getEvent = {
    httpMethod: 'GET',
    path: '/products/public',
    queryStringParameters: { page: '1', limit: '5' },
    headers: {}
  };

  const res1 = await handler(getEvent);
  console.log('GET /public result:', res1.statusCode);
  console.log(res1.body);

  // Test POST /products (create) using a minimal jwt-like token with payload
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: 'test-sub', email: 'test@example.com' })).toString('base64url');
  const token = `${header}.${payload}.`;

  const postEvent = {
    httpMethod: 'POST',
    path: '/products',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'PoC Product', specs: 'Specs', images: [], priceBRL: 10.5 })
  };

  const res2 = await handler(postEvent);
  console.log('POST /products result:', res2.statusCode);
  console.log(res2.body);
}

run().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
