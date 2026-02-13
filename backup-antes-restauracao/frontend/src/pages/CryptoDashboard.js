import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CryptoDashboard = () => {
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  // Carregar dados
  useEffect(() => {
    loadCryptoData();
  }, []);

  const loadCryptoData = async () => {
    try {
      setLoading(true);
      
      // Buscar preços
      const pricesResponse = await axios.get('/api/crypto/prices');
      if (pricesResponse.data.success) {
        setPrices(pricesResponse.data.data);
      }
      
      // Buscar saldos (requer autenticação)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        const balancesResponse = await axios.get('/api/crypto/balances', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (balancesResponse.data.success) {
          setBalances(balancesResponse.data.data);
        }
        
        // Buscar transações
        const transactionsResponse = await axios.get('/api/crypto/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (transactionsResponse.data.success) {
          setTransactions(transactionsResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados de cripto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Você precisa estar logado');
        return;
      }
      
      const response = await axios.post('/api/crypto/buy', {
        crypto_symbol: selectedCrypto,
        amount_brl: parseFloat(buyAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success(`Compra de ${response.data.data.crypto_amount.toFixed(8)} ${selectedCrypto} realizada! Total: R$ ${response.data.data.total_brl.toFixed(2)} (com 10% de taxa)`);
        setBuyAmount('');
        loadCryptoData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao comprar');
    }
  };

  const handleSell = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        toast.error('Você precisa estar logado');
        return;
      }
      
      const response = await axios.post('/api/crypto/sell', {
        crypto_symbol: selectedCrypto,
        crypto_amount: parseFloat(sellAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success(`Venda de ${sellAmount} ${selectedCrypto} realizada! Você recebeu: R$ ${response.data.data.net_brl.toFixed(2)} (após 10% de taxa)`);
        setSellAmount('');
        loadCryptoData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao vender');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  const totalBalanceUSD = balances.reduce((sum, b) => sum + (b.balance_usd || 0), 0);
  const totalBalanceBRL = totalBalanceUSD * 5.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Painel de Criptomoedas</h1>
          <p className="text-gray-300">Compre, venda e gerencie suas criptomoedas</p>
        </motion.div>

        {/* Saldo Total */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-2">Saldo Total</p>
              <h2 className="text-5xl font-bold text-white">R$ {totalBalanceBRL.toFixed(2)}</h2>
              <p className="text-green-100 mt-2">${totalBalanceUSD.toFixed(2)} USD</p>
            </div>
            <Wallet size={64} className="text-green-100" />
          </div>
        </motion.div>

        {/* Compra e Venda */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Comprar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ArrowUpRight className="text-green-500" size={24} />
              Comprar Cripto
            </h3>
            
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
            >
              {Object.keys(prices).map(symbol => (
                <option key={symbol} value={symbol}>
                  {symbol} - ${prices[symbol].toFixed(symbol === 'SHIB' ? 8 : 2)}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              placeholder="Valor em BRL"
              className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
            />
            
            {buyAmount && prices[selectedCrypto] && (
              <p className="text-sm text-gray-600 mb-4">
                Você receberá: {(parseFloat(buyAmount) / prices[selectedCrypto]).toFixed(8)} {selectedCrypto}
                <br />
                Total com taxa (10%): R$ {(parseFloat(buyAmount) * 1.1).toFixed(2)}
              </p>
            )}
            
            <button
              onClick={handleBuy}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Comprar {selectedCrypto}
            </button>
          </motion.div>

          {/* Vender */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ArrowDownRight className="text-red-500" size={24} />
              Vender Cripto
            </h3>
            
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
            >
              {balances.map(balance => (
                <option key={balance.crypto_symbol} value={balance.crypto_symbol}>
                  {balance.crypto_symbol} - Saldo: {balance.balance.toFixed(8)}
                </option>
              ))}
            </select>
            
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              placeholder="Quantidade"
              step="0.00000001"
              className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
            />
            
            {sellAmount && prices[selectedCrypto] && (
              <p className="text-sm text-gray-600 mb-4">
                Valor bruto: R$ {(parseFloat(sellAmount) * prices[selectedCrypto] * 5.5).toFixed(2)}
                <br />
                Você receberá (após 10%): R$ {(parseFloat(sellAmount) * prices[selectedCrypto] * 5.5 * 0.9).toFixed(2)}
              </p>
            )}
            
            <button
              onClick={handleSell}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Vender {selectedCrypto}
            </button>
          </motion.div>
        </div>

        {/* Meus Saldos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Meus Saldos</h3>
          
          {balances.length === 0 ? (
            <p className="text-gray-500">Você ainda não possui saldo em criptomoedas</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {balances.map(balance => (
                <div key={balance.crypto_symbol} className="border-2 border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">{balance.crypto_symbol}</span>
                    <DollarSign size={20} className="text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{balance.balance.toFixed(8)}</p>
                  <p className="text-sm text-gray-600">${balance.balance_usd.toFixed(2)} USD</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Histórico de Transações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Histórico de Transações</h3>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500">Nenhuma transação realizada</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map(tx => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    {tx.transaction_type === 'buy' ? (
                      <TrendingUp className="text-green-500" size={24} />
                    ) : (
                      <TrendingDown className="text-red-500" size={24} />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">
                        {tx.transaction_type === 'buy' ? 'Compra' : 'Venda'} de {tx.crypto_symbol}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(tx.created_at * 1000).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{tx.amount.toFixed(8)} {tx.crypto_symbol}</p>
                    <p className="text-sm text-gray-600">
                      ${tx.amount_usd.toFixed(2)} USD
                    </p>
                    <p className="text-xs text-gray-500">
                      Taxa: {tx.fee_percentage}% (R$ {tx.fee_amount.toFixed(2)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Informação sobre Comissões */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mt-8"
        >
          <p className="text-yellow-800">
            <strong>ℹ️ Importante:</strong> Todas as transações possuem uma taxa de <strong>10%</strong> que é destinada à manutenção da plataforma. 
            Os pagamentos em cripto são processados via MetaMask e blockchain, garantindo segurança e transparência.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CryptoDashboard;

