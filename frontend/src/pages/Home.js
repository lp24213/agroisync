import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            AGROSYNC
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Plataforma líder em inteligência agrícola, integrando dados em tempo real 
            do IBGE, Receita Federal e APIs globais para análise avançada de commodities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/cotacao" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
            >
              Cotação de Grãos
            </Link>
            <Link 
              to="/loja" 
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-300 hover:scale-105"
            >
              Marketplace
            </Link>
            <Link 
              to="/agroconecta" 
              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 hover:scale-105"
            >
              AgroConecta
            </Link>
            <Link 
              to="/cripto" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
            >
              Cripto & DeFi
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Geolocalização</h3>
              <p className="text-gray-400">Preços baseados na sua localização via GPS e IP</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">API Agrolink</h3>
              <p className="text-gray-400">Cotações em tempo real do mercado agrícola</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Análise de Dados</h3>
              <p className="text-gray-400">Gráficos e métricas do mercado futuro</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">APIs Externas</h3>
              <p className="text-gray-400">IBGE, Receita Federal e FAO integrados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">6</div>
              <div className="text-gray-400">Tipos de Grãos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400">Atualizações</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-gray-400">Tempo Real</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">API</div>
              <div className="text-gray-400">Integração</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
