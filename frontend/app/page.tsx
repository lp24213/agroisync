'use client';

export default function Home() {
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
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
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
          Deploy realizado com sucesso na Vercel!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            ✅ Frontend Online
          </div>
          <div style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            🚀 Vercel Deploy
          </div>
          <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            🔒 SSL Ativo
          </div>
        </div>
      </div>
    </div>
  );
}
