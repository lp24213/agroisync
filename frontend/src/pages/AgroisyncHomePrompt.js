import React from 'react';
// import AgroisyncHeaderPrompt from '../components/AgroisyncHeaderPrompt'; // Componente removido
// import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt'; // Componente removido
// import AgroisyncFooterPrompt from '../components/AgroisyncFooterPrompt'; // Componente removido

const AgroisyncHomePrompt = () => {
  return (
    <div>
      {/* HEADER PADRÃO */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">AGROISYNC</h1>
        </div>
      </div>
      
      {/* HERO COM IMAGEM 4K */}
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">AGROISYNC</h1>
          <p className="text-xl text-gray-600 mb-8">Conectando o agronegócio brasileiro</p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Hero Section em Desenvolvimento</h2>
            <p className="text-gray-500">Em breve teremos uma seção hero completa disponível!</p>
          </div>
        </div>
      </div>
      
      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ paddingTop: '72px' }}>
        {/* Seção de Features */}
        <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', color: 'var(--brand-dark)' }}>
              Nossos Serviços
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '30px' 
            }}>
              <div style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--brand-green)', marginBottom: '16px' }}>Marketplace</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Conecte-se com compradores e vendedores em uma plataforma segura e eficiente.
                </p>
              </div>
              
              <div style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--brand-green)', marginBottom: '16px' }}>AgroConecta</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Logística inteligente para otimizar toda a cadeia de suprimentos agrícolas.
                </p>
              </div>
              
              <div style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: 'var(--brand-green)', marginBottom: '16px' }}>Tecnologia</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Transações seguras e transparentes com tecnologia blockchain de ponta.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Estatísticas */}
        <section style={{ padding: '60px 20px', backgroundColor: 'var(--brand-dark)', color: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '40px' }}>Nossos Números</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '30px' 
            }}>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '8px' }}>
                  10K+
                </div>
                <div>Usuários Ativos</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '8px' }}>
                  50K+
                </div>
                <div>Transações</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '8px' }}>
                  $2M+
                </div>
                <div>Volume</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--brand-green)', marginBottom: '8px' }}>
                  99.9%
                </div>
                <div>Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 AGROISYNC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AgroisyncHomePrompt;
