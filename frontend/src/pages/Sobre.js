import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Sobre = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            Sobre o AGROSYNC
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plataforma líder em inteligência agrícola, integrando dados em tempo real 
            do IBGE, Receita Federal e APIs globais para análise avançada de commodities.
          </p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">Nossa Missão</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Conectar o agronegócio brasileiro através de tecnologia de ponta, 
                oferecendo dados precisos, análises avançadas e ferramentas para 
                tomada de decisão estratégica no mercado agrícola.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Integramos APIs oficiais do governo brasileiro com dados globais 
                para fornecer a visão mais completa e atualizada do mercado.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-white">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-semibold">contato@agroisync.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Telefone</div>
                    <div className="text-white font-semibold">(66) 99236-2830</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Localização</div>
                    <div className="text-white font-semibold">Sinop - MT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Por que escolher o AGROSYNC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Dados Oficiais</h3>
              <p className="text-gray-400">Integração direta com IBGE, Receita Federal e APIs governamentais</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Tempo Real</h3>
              <p className="text-gray-400">Atualizações automáticas 24/7 com dados do mercado</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Cobertura Global</h3>
              <p className="text-gray-400">Dados de exportação FAO e mercados internacionais</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-green-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Acesse agora mesmo e descubra o poder dos dados agrícolas em tempo real.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/cotacao" 
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Ver Cotações
            </Link>
            <Link 
              to="/cadastro" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-300"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sobre;
