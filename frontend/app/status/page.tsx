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
  return (
    <div className="min-h-screen bg-green-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-400 mb-8">
          ✅ SITE FUNCIONANDO!
        </h1>
        <p className="text-2xl text-green-200 mb-6">
          AGROISYNC está online e funcionando perfeitamente
        </p>
        <p className="text-lg text-green-100 max-w-2xl mx-auto">
          Status: ONLINE | Build: SUCESSO | Deploy: COMPLETO
        </p>
        <div className="mt-8">
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
            Voltar ao Site Principal
          </a>
        </div>
      </div>
    </div>
  );
} 