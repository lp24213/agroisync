'use client';

import React from 'react';
import CryptoChart from '../../components/CryptoChart';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-white mb-8">
          <h1 className="text-6xl font-bold mb-4">🚀 AGROTM.SOL</h1>
          <p className="text-2xl mb-8">Deploy Funcionando!</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <p className="text-lg">✅ Frontend Online</p>
            <p className="text-lg">✅ Next.js Funcionando</p>
            <p className="text-lg">✅ Vercel Deploy OK</p>
            <p className="text-lg">✅ Rotas Funcionando</p>
            <p className="text-lg">✅ APIs Moralis & CoinCap Integradas</p>
          </div>
          <div className="mb-8">
            <a 
              href="/" 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ir para Home
            </a>
          </div>
        </div>

        {/* Seção de Teste das APIs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">🧪 Teste das APIs</h2>
          <p className="text-white mb-6">
            Esta seção demonstra a integração com as APIs Moralis (blockchain, NFTs, transações) 
            e CoinCap (preços, gráficos, volume, market cap).
          </p>
          
          {/* Componente CryptoChart */}
          <div className="bg-black/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Dados de Criptomoedas</h3>
            <CryptoChart 
              defaultAssetId="bitcoin"
              // walletAddress="0x1234567890123456789012345678901234567890" // Descomente para testar com uma carteira
            />
          </div>
        </div>

        {/* Instruções de Configuração */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">⚙️ Configuração</h2>
          <div className="text-white space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Variáveis de Ambiente</h3>
              <p className="text-sm">
                Para usar as APIs, configure as seguintes variáveis no arquivo <code className="bg-black/50 px-2 py-1 rounded">.env.local</code>:
              </p>
              <pre className="bg-black/50 p-4 rounded-lg mt-2 text-sm overflow-x-auto">
{`# Moralis API Key
NEXT_PUBLIC_MORALIS_API_KEY=seu_token_moralis_aqui

# Outras APIs já configuradas
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=sua_chave_alpha_vantage
NEXT_PUBLIC_QUANDL_API_KEY=sua_chave_quandl
NEXT_PUBLIC_YAHOO_FINANCE_API_KEY=sua_chave_yahoo_finance
NEXT_PUBLIC_FINNHUB_API_KEY=sua_chave_finnhub`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Funcionalidades Disponíveis</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Moralis API:</strong> NFTs, transações, saldos de tokens, metadados</li>
                <li><strong>CoinCap API:</strong> Preços, gráficos, volume, market cap</li>
                <li><strong>Hooks Personalizados:</strong> useMoralis, useCoinCap</li>
                <li><strong>Componentes:</strong> CryptoChart (exemplo integrado)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Documentação</h3>
              <p className="text-sm">
                Consulte o arquivo <code className="bg-black/50 px-2 py-1 rounded">docs/api-integration-examples.md</code> 
                para exemplos detalhados de uso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 