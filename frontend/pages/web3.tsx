import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Web3Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function connectWallet() {
    setError('');
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Metamask não encontrada');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (err: any) {
      setError('Permissão negada ou erro ao conectar.');
    }
  }

  useEffect(() => {
    if (!account || typeof window === 'undefined' || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.getBalance(account).then((bal) => {
      setBalance(ethers.formatEther(bal));
    });
  }, [account]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0] || null);
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-futuristic text-primary mb-6">Integração Web3 & Metamask</h1>
        {!account ? (
          <button onClick={connectWallet} className="px-6 py-3 bg-primary rounded-xl font-futuristic text-black hover:bg-accent mb-4">Conectar Carteira</button>
        ) : (
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="mb-2 text-lg text-primary">Carteira conectada:</div>
            <div className="mb-4 text-white font-mono">{account}</div>
            <div className="mb-2 text-lg text-primary">Saldo ETH:</div>
            <div className="mb-4 text-white font-mono">{balance} ETH</div>
          </div>
        )}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </main>
      <Footer />
    </div>
  );
} 