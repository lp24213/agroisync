const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

console.log('🔍 Testing AGROTM Backend Health Check...');
console.log(`📍 URL: http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📄 Response: ${data}`);
    
    if (res.statusCode === 200 && data.trim() === 'OK') {
      console.log('✅ Healthcheck PASSED! Backend is healthy.');
      process.exit(0);
    } else {
      console.log('❌ Healthcheck FAILED! Backend is not responding correctly.');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Error:', err.message);
  console.log('💡 Make sure the backend server is running: node server.js');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('⏰ Timeout: Request took too long');
  req.destroy();
  process.exit(1);
});

req.end(); 