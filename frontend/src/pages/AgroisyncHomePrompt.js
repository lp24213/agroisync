import React from 'react';
import AgroisyncHeaderPrompt from '../components/AgroisyncHeaderPrompt';
import AgroisyncHeroPrompt from '../components/AgroisyncHeroPrompt';
import AgroisyncFooterPrompt from '../components/AgroisyncFooterPrompt';

const AgroisyncHomePrompt = () => {
  return (
    <div>
      {/* HEADER PADRÃO */}
      <AgroisyncHeaderPrompt />
      
      {/* HERO COM IMAGEM 4K */}
      <AgroisyncHeroPrompt 
        title="Agroisync"
        subtitle="A Plataforma de Agronegócio Mais Futurista do Mundo"
        heroImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop&q=80"
        showCTA={true}
      />
      
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
      <AgroisyncFooterPrompt />
    </div>
  );
};

export default AgroisyncHomePrompt;
