import { useState, useEffect } from 'react'

export default function Home() {
  const [status, setStatus] = useState('Carregando...')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('API offline'))
  }, [])

  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      fontFamily: 'Arial',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🚀 AgroSync Funcionando!</h1>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '15px',
        margin: '30px auto',
        maxWidth: '600px'
      }}>
        <h2>Status do Sistema</h2>
        <p><strong>Frontend:</strong> ✅ Online</p>
        <p><strong>Backend:</strong> {status}</p>
        <p><strong>Deploy:</strong> {new Date().toLocaleString()}</p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '40px',
        maxWidth: '800px',
        margin: '40px auto 0'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>🌱 Gestão</h3>
          <p>Sistema de gestão agrícola</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>📊 Relatórios</h3>
          <p>Análises e métricas</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>⚙️ Config</h3>
          <p>Configurações</p>
        </div>
      </div>
    </div>
  )
}
