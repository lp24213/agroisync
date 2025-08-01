'use client';

import { useWeb3 } from '../contexts/Web3Context';

export default function Home() {
  const { isConnected, connect, disconnect } = useWeb3();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        padding: '2rem',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          AGROTM.SOL
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#06b6d4' }}>
          Next-Generation DeFi Platform
        </p>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#d1d5db' }}>
          Experience the future of decentralized finance with cutting-edge blockchain technology
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          {!isConnected ? (
            <button
              onClick={connect}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={disconnect}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Disconnect Wallet
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            ✅ Frontend Online
          </div>
          <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            🚀 Vercel Deploy
          </div>
          <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            🔒 SSL Ativo
          </div>
          <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            ⚡ Performance
          </div>
        </div>
      </div>
    </div>
  );
}
