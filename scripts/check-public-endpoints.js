const fetch = require('node-fetch');
const endpoints = [
  { method: 'GET', url: 'http://localhost:8787/api/products' },
  { method: 'GET', url: 'http://localhost:8787/api/freight' },
  { method: 'GET', url: 'http://localhost:8787/api/plans' },
];

const sensitive = ['cpf','cnpj','user_id','userId','email','vehicle_plate','ssn','password','token'];

(async () => {
  console.log('Checking public endpoints for sensitive fields...');
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: ep.method });
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch (e) { /* not json */ }
      const body = json ? JSON.stringify(json) : text;
      const found = sensitive.filter(s => body.includes(s));
      console.log(`- ${ep.method} ${ep.url} -> status ${res.status}, length ${body.length}, sensitive hits: ${found.length ? found.join(', ') : 'none'}`);
    } catch (e) {
      console.error(`Error calling ${ep.url}:`, e.message);
    }
  }
})();
