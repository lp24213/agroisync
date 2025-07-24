/**
 * Health Check API Endpoint
 * Provides system health status for monitoring and load balancers
 */

import { NextResponse } from 'next/server';
import { logger } from '@/src/utils/logger';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Basic health checks
    const healthChecks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      services: {
        database: await checkDatabaseHealth(),
        solana: await checkSolanaHealth(),
        external_apis: await checkExternalAPIs(),
      },
    };

    const responseTime = Date.now() - startTime;
    (healthChecks as any).responseTime = `${responseTime}ms`;

    // Determine overall health status
    const isHealthy = Object.values(healthChecks.services).every(
      service => service.status === 'healthy'
    );

    const status = isHealthy ? 200 : 503;
    if (!isHealthy) {
      healthChecks.status = 'unhealthy';
    }

    logger.info('Health check completed', {
      status: healthChecks.status,
      responseTime,
      services: healthChecks.services,
    });

    return NextResponse.json(healthChecks, { status });
  } catch (error) {
    logger.error('Health check failed', { error });
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

async function checkDatabaseHealth(): Promise<{ status: string; responseTime?: string; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Add your database health check here
    // For now, we'll simulate a successful check
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const responseTime = Date.now() - startTime;
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkSolanaHealth(): Promise<{ status: string; responseTime?: string; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Check Solana RPC endpoint
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth',
      }),
    });

    if (!response.ok) {
      throw new Error(`Solana RPC returned ${response.status}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      status: data.result === 'ok' ? 'healthy' : 'unhealthy',
      responseTime: `${responseTime}ms`,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkExternalAPIs(): Promise<{ status: string; responseTime?: string; error?: string }> {
  try {
    const startTime = Date.now();
    
    // Check external API endpoints (e.g., CoinGecko)
    const checks = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/ping', { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) 
      }),
    ]);

    const allSuccessful = checks.every(
      check => check.status === 'fulfilled' && check.value.ok
    );

    const responseTime = Date.now() - startTime;

    return {
      status: allSuccessful ? 'healthy' : 'degraded',
      responseTime: `${responseTime}ms`,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
