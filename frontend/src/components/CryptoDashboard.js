import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [userWallet, setUserWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  // Sua MetaMask principal
  const MASTER_WALLET = '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

  // Simulação de dados de criptomoedas (em produção, viria da API)
  const mockCryptoData = useMemo(
    () => [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 115511.956,
        change24h: -1.92,
        volume: 28500000000,
        marketCap: 2270000000000
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3892.45,
        change24h: 2.34,
        volume: 15200000000,
        marketCap: 468000000000
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        price: 0.45,
        change24h: 3.21,
        volume: 850000000,
        marketCap: 15000000000
      }
    ],
    []
  );

  useEffect(() => {
    setCryptoData(mockCryptoData);

    // Simular atualização em tempo real
    const interval = setInterval(() => {
      setCryptoData(prevData =>
        prevData.map(crypto => ({
          ...crypto,
          price: crypto.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: crypto.change24h + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [mockCryptoData]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        setUserWallet(accounts[0]);
        setIsConnected(true);

        // Registrar cliente na blockchain
        await registerClient(accounts[0]);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erro ao conectar MetaMask:', error);
        }
      }
    } else {
      alert('MetaMask não encontrado! Instale a extensão.');
    }
  };

  const registerClient = async walletAddress => {
    // Aqui você faria a chamada para sua blockchain
    // Registrando o cliente e criando seu painel
    if (process.env.NODE_ENV !== 'production') {

      console.log('Registrando cliente:', walletAddress);

    }

    // Simulação de registro
    const clientData = {
      address: walletAddress,
      balance: {
        BTC: 0.5,
        ETH: 2.3,
        AGRO: 1000
      },
      transactions: [],
      joinDate: new Date()
    };

    // Salvar dados do cliente (em produção, seria na blockchain)
    localStorage.setItem(`client_${walletAddress}`, JSON.stringify(clientData));
  };

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendPayment = async (amount, currency) => {
    if (!window.ethereum || !userWallet) return;

    try {
      const transactionParameters = {
        to: MASTER_WALLET, // Sua MetaMask
        from: userWallet,
        value: '0x' + (amount * Math.pow(10, 18)).toString(16), // ETH em wei
        gas: '0x5208' // 21000 gas
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });

      if (process.env.NODE_ENV !== 'production') {


        console.log('Pagamento enviado:', txHash);


      }
      alert(`Pagamento de ${amount} ${currency} enviado com sucesso!`);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erro no pagamento:', error);
      }
    }
  };

  return (
    <div className='crypto-dashboard'>
      {/* Header */}
      <div className='dashboard-header'>
        <h2>Dashboard Crypto Agroisync</h2>
        <div className='wallet-info'>
          {isConnected ? (
            <div className='connected-wallet'>
              <span>
                Conectado: {userWallet?.slice(0, 6)}...{userWallet?.slice(-4)}
              </span>
              <button onClick={() => copyToClipboard(userWallet)}>
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ) : (
            <button onClick={connectMetaMask} className='connect-btn'>
              <Wallet size={20} />
              Conectar MetaMask
            </button>
          )}
        </div>
      </div>

      {/* Cards de Criptomoedas */}
      <div className='crypto-cards'>
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.id}
            className='crypto-card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className='card-header'>
              <h3
                style={{
                  color: 'var(--accent)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <DollarSign size={24} />
                {crypto.name} ({crypto.symbol})
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${crypto.price.toLocaleString()}</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: crypto.change24h >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                  }}
                >
                  {crypto.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{crypto.change24h.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Gráfico Simulado */}
            <div
              style={{
                height: '200px',
                background: 'linear-gradient(135deg, rgba(42, 127, 79, 0.1) 0%, rgba(42, 127, 79, 0.05) 100%)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(45deg, 
                  rgba(42, 127, 79, 0.1) 0%, 
                  rgba(42, 127, 79, 0.3) 50%, 
                  rgba(42, 127, 79, 0.1) 100%)`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}
              >
                📈 Gráfico em Tempo Real
              </div>
            </div>

            {/* Botões de Ação */}
            {isConnected && (
              <div className='card-actions'>
                <button onClick={() => sendPayment(0.1, crypto.symbol)} className='buy-btn'>
                  Comprar {crypto.symbol}
                </button>
                <button onClick={() => sendPayment(0.05, crypto.symbol)} className='sell-btn'>
                  Vender {crypto.symbol}
                </button>
              </div>
            )}

            {/* Informações Adicionais */}
            <div className='crypto-info'>
              <div className='info-item'>
                <span>Volume 24h:</span>
                <span>${crypto.volume.toLocaleString()}</span>
              </div>
              <div className='info-item'>
                <span>Market Cap:</span>
                <span>${crypto.marketCap.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seção de Saldo do Cliente */}
      {isConnected && (
        <div className='client-balance'>
          <h3>Seu Saldo</h3>
          <button onClick={() => setShowBalance(!showBalance)} className='toggle-balance'>
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            {showBalance ? 'Ocultar' : 'Mostrar'} Saldo
          </button>

          {showBalance && (
            <div className='balance-grid'>
              <div className='balance-item'>
                <span>BTC</span>
                <span>0.5</span>
              </div>
              <div className='balance-item'>
                <span>ETH</span>
                <span>2.3</span>
              </div>
              <div className='balance-item'>
                <span>AGRO</span>
                <span>1000</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informações do Master Wallet */}
      <div className='master-wallet-info'>
        <h3>Master Wallet (Sua MetaMask)</h3>
        <div className='wallet-address'>
          <span>{MASTER_WALLET}</span>
          <button onClick={() => copyToClipboard(MASTER_WALLET)}>
            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p className='wallet-description'>
          Todos os pagamentos em cripto são direcionados para esta carteira. Você tem controle total sobre sua
          blockchain.
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(42, 127, 79, 0.05)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'var(--muted)',
          textAlign: 'center'
        }}
      >
        <p style={{ margin: '0px' }}>Dados atualizados em tempo real • Blockchain própria Agroisync</p>
      </div>
    </div>
  );
};

export default CryptoDashboard;
