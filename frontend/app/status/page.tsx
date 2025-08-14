'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';

interface HealthStatus {
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
      coinGecko: 'ok' | 'error';
      solana: 'ok' | 'error';
      ethereum: 'ok' | 'error';
    };
  };
}

export default function StatusPage() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthStatus(data);
      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'ok' | 'error') => {
    return status === 'ok' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (status: 'ok' | 'error') => {
    return (
      <Badge variant={status === 'ok' ? 'default' : 'destructive'}>
        {status === 'ok' ? 'OK' : 'ERROR'}
      </Badge>
    );
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatMemory = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  if (loading && !healthStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Checking System Status</h1>
          <p className="text-gray-600">Please wait while we verify all services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AGROISYNC System Status</h1>
          <p className="text-gray-600 mb-4">
            Real-time monitoring of all system components and services
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={checkHealth} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Checking...' : 'Refresh Status'}
            </Button>
            {lastChecked && (
              <span className="text-sm text-gray-500">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error checking system status:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {healthStatus && (
          <>
            {/* Overall Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  Overall System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {healthStatus.status === 'healthy' ? '🟢' : '🔴'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                    <Badge variant={healthStatus.status === 'healthy' ? 'default' : 'destructive'}>
                      {healthStatus.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {healthStatus.version}
                    </div>
                    <div className="text-sm text-gray-600">Version</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {healthStatus.environment}
                    </div>
                    <div className="text-sm text-gray-600">Environment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {formatUptime(healthStatus.uptime)}
                    </div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Checks */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Health Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(healthStatus.checks.database)}
                    <div>
                      <div className="font-medium">Database</div>
                      <div className="text-sm text-gray-600">
                        {healthStatus.details.database.connection}
                      </div>
                    </div>
                    {getStatusBadge(healthStatus.checks.database)}
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(healthStatus.checks.firebase)}
                    <div>
                      <div className="font-medium">Firebase</div>
                      <div className="text-sm text-gray-600">
                        {healthStatus.details.firebase.connection}
                      </div>
                    </div>
                    {getStatusBadge(healthStatus.checks.firebase)}
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(healthStatus.checks.apis)}
                    <div>
                      <div className="font-medium">External APIs</div>
                      <div className="text-sm text-gray-600">
                        CoinGecko, Solana, Ethereum
                      </div>
                    </div>
                    {getStatusBadge(healthStatus.checks.apis)}
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(healthStatus.checks.memory)}
                    <div>
                      <div className="font-medium">Memory</div>
                      <div className="text-sm text-gray-600">
                        {healthStatus.details.memory.percentage}% used
                      </div>
                    </div>
                    {getStatusBadge(healthStatus.checks.memory)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Memory Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Used Memory:</span>
                      <span className="font-medium">{formatMemory(healthStatus.details.memory.used)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Memory:</span>
                      <span className="font-medium">{formatMemory(healthStatus.details.memory.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage Percentage:</span>
                      <span className="font-medium">{healthStatus.details.memory.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          healthStatus.details.memory.percentage < 70
                            ? 'bg-green-500'
                            : healthStatus.details.memory.percentage < 90
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${healthStatus.details.memory.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Status */}
              <Card>
                <CardHeader>
                  <CardTitle>External API Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>CoinGecko API:</span>
                      {getStatusBadge(healthStatus.details.apis.coinGecko)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Solana RPC:</span>
                      {getStatusBadge(healthStatus.details.apis.solana)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Ethereum RPC:</span>
                      {getStatusBadge(healthStatus.details.apis.ethereum)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timestamp */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Last updated: {new Date(healthStatus.timestamp).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 