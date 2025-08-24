import React, { useState } from 'react';
import CryptoTicker from '../components/crypto/CryptoTicker';
import CryptoChart from '../components/crypto/CryptoChart';

const Cripto = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          
          // Simular balance
          const mockBalance = (Math.random() * 10).toFixed(4);
          setBalance(mockBalance);
        }
      } else {
        alert('MetaMask não está instalado!');
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error);
      alert('Erro ao conectar carteira');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setBalance('0');
  };



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Cripto & DeFi
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plataforma avançada de finanças descentralizadas integrando Metamask, 
            Stripe e soluções Web3 para o agronegócio.
          </p>
        </div>
      </section>

      {/* Cryptocurrency Ticker */}
      <CryptoTicker />

      {/* Cryptocurrency Chart Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Dashboard de Criptomoedas
          </h2>
          <CryptoChart />
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Conecte sua Carteira
            </h2>
            
            {!isConnected ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
                <p className="text-gray-300 mb-6">
                  Conecte sua carteira MetaMask para acessar as funcionalidades DeFi
                </p>
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Conectando...' : 'Conectar MetaMask'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">Carteira Conectada</p>
                    <p className="text-white font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-green-400 font-bold">{balance} ETH</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={disconnectWallet}
                    className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Desconectar
                  </button>
                  <button
                    onClick={() => alert('Funcionalidade em desenvolvimento')}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Ver Transações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DeFi Features Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Funcionalidades DeFi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Staking</h3>
              <p className="text-gray-400">Stake seus tokens e ganhe recompensas</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Yield Farming</h3>
              <p className="text-gray-400">Maximize seus retornos com farming</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Liquidity Pools</h3>
              <p className="text-gray-400">Forneça liquidez e ganhe fees</p>
            </div>
          </div>
        </div>
      </section>



      {/* Stripe Integration Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Integração com Stripe
          </h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Pagamentos Tradicionais
            </h3>
            <p className="text-gray-300 mb-6">
              Aceite pagamentos em reais através do Stripe, integrado com nossa 
              plataforma DeFi para conversão automática de moedas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Cartão de Crédito</p>
                <p className="text-white font-semibold">Visa, Mastercard</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">PIX</p>
                <p className="text-white font-semibold">Transferência Imediata</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Boleto</p>
                <p className="text-white font-semibold">Pagamento Bancário</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Pronto para o Futuro das Finanças?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Experimente a primeira plataforma DeFi integrada ao agronegócio brasileiro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={connectWallet}
              className="px-8 py-4 bg-white text-purple-900 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Conectar Carteira
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-purple-900 transition-colors duration-300">
              Saber Mais
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cripto;
