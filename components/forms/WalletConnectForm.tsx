'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useWeb3 } from '@/hooks/useWeb3';

export function WalletConnectForm() {
  const { isConnected, isConnecting, connect, disconnect, publicKey, error } = useWeb3();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected) {
    return (
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-agro-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Carteira Conectada</h2>
          <p className="text-gray-400 mb-4">
            {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
          </p>
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="text-center">
        <div className="w-16 h-16 bg-agro-blue rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl">🔗</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Conectar Carteira</h2>
        <p className="text-gray-400 mb-6">
          Conecte sua carteira Solana para começar a usar a plataforma
        </p>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
        </Button>
        
        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>Suportamos as seguintes carteiras:</p>
          <div className="flex justify-center gap-4 mt-2">
            <span>Phantom</span>
            <span>Solflare</span>
            <span>Slope</span>
          </div>
        </div>
      </div>
    </Card>
  );
} 