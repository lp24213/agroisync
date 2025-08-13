import { NextRequest, NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    database: 'ok' | 'error';
    firebase: 'ok' | 'error';
    apis: 'ok' | 'error';
    memory: 'ok' | 'error';
  };
  details: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    database: {
      connection: string;
      responseTime: number;
    };
    firebase: {
      connection: string;
      auth: string;
    };
    apis: {
      coinGecko: string;
      solana: string;
      ethereum: string;
    };
  };
}

async function checkDatabase(): Promise<{ status: 'ok' | 'error'; responseTime: number }> {
  try {
    const startTime = Date.now();
    // Simulate database check (replace with actual MongoDB/PostgreSQL check)
    await new Promise(resolve => setTimeout(resolve, 100));
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'ok',
      responseTime
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: 0
    };
  }
}

async function checkFirebase(): Promise<{ connection: string; auth: string }> {
  try {
    // Simulate Firebase check (replace with actual Firebase Admin SDK check)
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      connection: 'connected',
      auth: 'enabled'
    };
  } catch (error) {
    return {
      connection: 'error',
      auth: 'error'
    };
  }
}

async function checkAPIs(): Promise<{ coinGecko: string; solana: string; ethereum: string }> {
  try {
    const results = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/ping', { method: 'GET' }),
      fetch('https://api.mainnet-beta.solana.com', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth' }) }),
      fetch('https://mainnet.infura.io/v3/demo', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber' }) })
    ]);

    return {
      coinGecko: results[0].status === 'fulfilled' && results[0].value.ok ? 'ok' : 'error',
      solana: results[1].status === 'fulfilled' && results[1].value.ok ? 'ok' : 'error',
      ethereum: results[2].status === 'fulfilled' && results[2].value.ok ? 'ok' : 'error'
    };
  } catch (error) {
    return {
      coinGecko: 'error',
      solana: 'error',
      ethereum: 'error'
    };
  }
}

function getMemoryUsage() {
  if (typeof process !== 'undefined') {
    const used = process.memoryUsage();
    const total = used.heapTotal;
    const percentage = (used.heapUsed / total) * 100;
    
    return {
      used: Math.round(used.heapUsed / 1024 / 1024), // MB
      total: Math.round(total / 1024 / 1024), // MB
      percentage: Math.round(percentage)
    };
  }
  
  return {
    used: 0,
    total: 0,
    percentage: 0
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now();
    
    // Perform health checks
    const [databaseCheck, firebaseCheck, apisCheck] = await Promise.all([
      checkDatabase(),
      checkFirebase(),
      checkAPIs()
    ]);

    const memoryUsage = getMemoryUsage();
    const uptime = process.uptime ? Math.round(process.uptime) : 0;
    
    // Determine overall status
    const checks = {
      database: databaseCheck.status,
      firebase: 'ok', // Firebase check is always ok for now
      apis: apisCheck.coinGecko === 'ok' && apisCheck.solana === 'ok' && apisCheck.ethereum === 'ok' ? 'ok' : 'error',
      memory: memoryUsage.percentage < 90 ? 'ok' : 'error'
    };
    
    const overallStatus = Object.values(checks).every(check => check === 'ok') ? 'healthy' : 'unhealthy';
    
    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.3.1',
      checks,
      details: {
        memory: memoryUsage,
        database: {
          connection: databaseCheck.status === 'ok' ? 'connected' : 'disconnected',
          responseTime: databaseCheck.responseTime
        },
        firebase: firebaseCheck,
        apis: apisCheck
      }
    };

    const responseTime = Date.now() - startTime;
    
    // Set appropriate status code
    const statusCode = overallStatus === 'healthy' ? 200 : 503;
    
    // Add response headers
    const response = NextResponse.json(healthCheck, { status: statusCode });
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    response.headers.set('X-Health-Status', overallStatus);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
    
  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: 0,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.3.1',
      checks: {
        database: 'error',
        firebase: 'error',
        apis: 'error',
        memory: 'error'
      },
      details: {
        memory: { used: 0, total: 0, percentage: 0 },
        database: { connection: 'error', responseTime: 0 },
        firebase: { connection: 'error', auth: 'error' },
        apis: { coinGecko: 'error', solana: 'error', ethereum: 'error' }
      }
    };
    
    return NextResponse.json(errorResponse, { status: 503 });
  }
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 200 });
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://agroisync.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
} 