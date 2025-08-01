const autocannon = require('autocannon');
const { program } = require('commander');

// Parse command line arguments
program
  .option('-u, --url <url>', 'Target URL', 'http://localhost:3001')
  .option('-d, --duration <seconds>', 'Test duration in seconds', '60')
  .option('-c, --connections <number>', 'Number of concurrent connections', '10')
  .option('-p, --pipelining <number>', 'Number of pipelined requests', '1')
  .option('-t, --timeout <seconds>', 'Request timeout in seconds', '10')
  .option('-r, --rate <number>', 'Request rate per second', '100')
  .option('-m, --method <method>', 'HTTP method', 'GET')
  .option('-H, --headers <headers>', 'Custom headers (JSON string)')
  .option('-b, --body <body>', 'Request body')
  .option('-f, --file <file>', 'Output file for results')
  .parse(process.argv);

const options = program.opts();

// Test scenarios
const testScenarios = [
  {
    name: 'Health Check',
    url: `${options.url}/health`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'API Stats',
    url: `${options.url}/api/stats/overview`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'DeFi Pools',
    url: `${options.url}/api/defi/pools`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Staking Pools',
    url: `${options.url}/api/staking/pools`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'User Registration',
    url: `${options.url}/api/auth/register`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: `test${Date.now()}@agrotm.com`,
      password: 'TestPass123!',
      walletAddress: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
    }),
    expectedStatus: 201
  },
  {
    name: 'User Login',
    url: `${options.url}/api/auth/login`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'test@agrotm.com',
      password: 'TestPass123!'
    }),
    expectedStatus: 200
  }
];

// Parse custom headers
let customHeaders = {};
if (options.headers) {
  try {
    customHeaders = JSON.parse(options.headers);
  } catch (error) {
    console.error('Invalid headers JSON:', error.message);
    process.exit(1);
  }
}

// Load test configuration
const loadTestConfig = {
  url: options.url,
  connections: parseInt(options.connections),
  duration: parseInt(options.duration),
  pipelining: parseInt(options.pipelining),
  timeout: parseInt(options.timeout),
  rate: parseInt(options.rate),
  method: options.method,
  headers: customHeaders,
  body: options.body,
  setupClient: (client) => {
    client.on('response', (client, statusCode, resBytes, responseTime) => {
      if (statusCode >= 400) {
        console.warn(`Warning: ${statusCode} status code received`);
      }
    });
  }
};

// Run load test for a specific scenario
async function runScenarioTest(scenario) {
  console.log(`\n🚀 Running load test: ${scenario.name}`);
  console.log(`📍 URL: ${scenario.url}`);
  console.log(`⏱️  Duration: ${options.duration}s`);
  console.log(`🔗 Connections: ${options.connections}`);
  console.log(`📊 Rate: ${options.rate} req/s`);
  console.log('─'.repeat(60));

  const config = {
    ...loadTestConfig,
    url: scenario.url,
    method: scenario.method,
    headers: {
      ...loadTestConfig.headers,
      ...scenario.headers
    },
    body: scenario.body || loadTestConfig.body
  };

  try {
    const result = await autocannon(config);
    
      console.log('\n📊 Results:');
  console.log(`✅ Average Latency: ${result.latency.average}ms`);
  console.log(`📈 Requests/sec: ${result.requests.average}`);
  console.log(`📉 Error Rate: ${result.errors}%`);
  console.log(`🔄 Total Requests: ${result.requests.total}`);
  console.log(`⏱️  Total Duration: ${result.duration}s`);
  console.log(`📊 2xx Responses: ${result['2xx']}`);
  console.log(`❌ 4xx Responses: ${result['4xx']}`);
  console.log(`💥 5xx Responses: ${result['5xx']}`);

    // Performance analysis
    const avgLatency = result.latency.average;
    const requestsPerSec = result.requests.average;
    const errorRate = result.errors;

    console.log('\n🎯 Performance Analysis:');
    
    if (avgLatency < 100) {
              console.log('✅ Latency: Excellent (< 100ms)');
      } else if (avgLatency < 500) {
        console.log('🟡 Latency: Good (100-500ms)');
      } else if (avgLatency < 1000) {
        console.log('🟠 Latency: Acceptable (500-1000ms)');
      } else {
        console.log('🔴 Latency: Poor (> 1000ms)');
      }

    if (requestsPerSec > 1000) {
              console.log('✅ Throughput: Excellent (> 1000 req/s)');
      } else if (requestsPerSec > 500) {
        console.log('🟡 Throughput: Good (500-1000 req/s)');
      } else if (requestsPerSec > 100) {
        console.log('🟠 Throughput: Acceptable (100-500 req/s)');
      } else {
        console.log('🔴 Throughput: Poor (< 100 req/s)');
      }

    if (errorRate < 1) {
              console.log('✅ Error Rate: Excellent (< 1%)');
      } else if (errorRate < 5) {
        console.log('🟡 Error Rate: Good (1-5%)');
      } else if (errorRate < 10) {
        console.log('🟠 Error Rate: Acceptable (5-10%)');
      } else {
        console.log('🔴 Error Rate: Poor (> 10%)');
      }

    return result;
  } catch (error) {
    console.error(`❌ Error running test for ${scenario.name}:`, error.message);
    return null;
  }
}

// Run all scenarios
async function runAllTests() {
  console.log('🔥 AGROTM Backend Load Testing Suite');
  console.log('='.repeat(60));
  console.log(`🎯 Target: ${options.url}`);
  console.log(`⏱️  Duration: ${options.duration}s per test`);
  console.log(`🔗 Connections: ${options.connections}`);
  console.log(`📊 Rate: ${options.rate} req/s`);
  console.log('='.repeat(60));

  const results = [];

  for (const scenario of testScenarios) {
    const result = await runScenarioTest(scenario);
    if (result) {
      results.push({
        scenario: scenario.name,
        ...result
      });
    }
  }

  // Summary report
  console.log('\n📋 SUMMARY REPORT');
  console.log('='.repeat(60));
  
  const totalRequests = results.reduce((sum, r) => sum + r.requests.total, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);
  const avgLatency = results.reduce((sum, r) => sum + r.latency.average, 0) / results.length;
  const avgThroughput = results.reduce((sum, r) => sum + r.requests.average, 0) / results.length;

  console.log(`📊 Total Requests: ${totalRequests.toLocaleString()}`);
  console.log(`❌ Total Errors: ${totalErrors.toLocaleString()}`);
  console.log(`⏱️  Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`📈 Average Throughput: ${avgThroughput.toFixed(2)} req/s`);
  console.log(`🎯 Tests Completed: ${results.length}/${testScenarios.length}`);

  // Save results to file if specified
  if (options.file) {
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      config: {
        url: options.url,
        duration: options.duration,
        connections: options.connections,
        rate: options.rate
      },
      results: results,
      summary: {
        totalRequests,
        totalErrors,
        avgLatency,
        avgThroughput
      }
    };

    fs.writeFileSync(options.file, JSON.stringify(report, null, 2));
    console.log(`\n💾 Results saved to: ${options.file}`);
  }

  console.log('\n✅ Load testing completed!');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Load testing interrupted by user');
  process.exit(0);
});

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Load testing failed:', error);
  process.exit(1);
}); 