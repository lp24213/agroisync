import { useState, useEffect } from 'react'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('Carregando...')

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(() => setBackendStatus('Backend offline'))
  }, [])

  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>🚀 AgroSync - Sistema Funcionando!</h1>
      <div style={{
        background: '#f0f8ff',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2>Status do Sistema</h2>
        <p><strong>Frontend:</strong> ✅ Funcionando</p>
        <p><strong>Backend:</strong> {backendStatus}</p>
        <p><strong>Deploy:</strong> {new Date().toLocaleString()}</p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{background: '#e8f5e8', padding: '20px', borderRadius: '8px'}}>
          <h3>🌱 Gestão Agrícola</h3>
          <p>Sistema completo de gestão</p>
        </div>
        <div style={{background: '#fff3cd', padding: '20px', borderRadius: '8px'}}>
          <h3>📊 Relatórios</h3>
          <p>Análises e métricas</p>
        </div>
        <div style={{background: '#d1ecf1', padding: '20px', borderRadius: '8px'}}>
          <h3>🔧 Configurações</h3>
          <p>Personalização do sistema</p>
        </div>
      </div>
    </div>
  )
}
