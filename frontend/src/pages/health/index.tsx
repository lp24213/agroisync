import { useState, useEffect } from 'react';
import { NextPage } from 'next';

interface HealthStatus {
  ok: boolean;
  ts: string;
  service: string;
  version: string;
  uptime?: number;
  memory?: any;
  env?: string;
}

const HealthPage: NextPage = () => {
  const [frontendHealth, setFrontendHealth] = useState<HealthStatus>({
    ok: true,
    ts: new Date().toISOString(),
    service: 'AGROISYNC Frontend',
    version: '0.1.0'
  });
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setBackendHealth(data);
      } else {
        setError(`Backend health check failed: ${response.status}`);
      }
    } catch (err) {
      setError(`Backend health check error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AGROISYNC Health Status
          </h1>
          <p className="text-gray-600">
            Monitoramento de saúde dos serviços
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Frontend Status
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">✅ Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{frontendHealth.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{frontendHealth.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="font-medium text-sm">
                  {new Date(frontendHealth.ts).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Backend Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Backend Status
            </h2>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Checking...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <div className="text-red-600 mb-2">❌ Error</div>
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={checkBackendHealth}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : backendHealth ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">✅ Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{backendHealth.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{backendHealth.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium">
                    {backendHealth.uptime ? `${Math.round(backendHealth.uptime)}s` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="font-medium text-sm">
                    {new Date(backendHealth.ts).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={checkBackendHealth}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Refresh Health Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
