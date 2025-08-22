import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AgroConecta = () => {
  const [activeTab, setActiveTab] = useState('fretes');
  const [fretes, setFretes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados simulados de fretes
  useEffect(() => {
    const mockFretes = [
      {
        id: 1,
        origem: 'Sinop - MT',
        destino: 'São Paulo - SP',
        produto: 'Soja',
        peso: '25 ton',
        valor: 'R$ 2.500,00',
        tipo: 'Carga Fechada',
        caminhoneiro: 'João Silva',
        telefone: '(66) 99999-9999',
        email: 'joao@transporte.com',
        status: 'disponível'
      },
      {
        id: 2,
        origem: 'Lucas do Rio Verde - MT',
        destino: 'Porto de Santos - SP',
        produto: 'Milho',
        peso: '30 ton',
        valor: 'R$ 3.200,00',
        tipo: 'Carga Fechada',
        caminhoneiro: 'Maria Santos',
        telefone: '(65) 88888-8888',
        email: 'maria@frete.com',
        status: 'em_transito'
      },
      {
        id: 3,
        origem: 'Cascavel - PR',
        destino: 'Rio de Janeiro - RJ',
        produto: 'Trigo',
        peso: '20 ton',
        valor: 'R$ 2.800,00',
        tipo: 'Carga Fechada',
        caminhoneiro: 'Pedro Costa',
        telefone: '(45) 77777-7777',
        email: 'pedro@logistica.com',
        status: 'disponível'
      }
    ];

    const mockUsuarios = [
      {
        id: 1,
        nome: 'João Silva',
        tipo: 'Caminhoneiro',
        localizacao: 'Sinop - MT',
        telefone: '(66) 99999-9999',
        email: 'joao@transporte.com',
        status: 'Ativo',
        avaliacao: 4.8
      },
      {
        id: 2,
        nome: 'Maria Santos',
        tipo: 'Caminhoneira',
        localizacao: 'Lucas do Rio Verde - MT',
        telefone: '(65) 88888-8888',
        email: 'maria@frete.com',
        status: 'Ativo',
        avaliacao: 4.9
      },
      {
        id: 3,
        nome: 'Pedro Costa',
        tipo: 'Produtor',
        localizacao: 'Cascavel - PR',
        telefone: '(45) 77777-7777',
        email: 'pedro@fazenda.com',
        status: 'Ativo',
        avaliacao: 4.7
      },
      {
        id: 4,
        nome: 'Ana Oliveira',
        tipo: 'Compradora',
        localizacao: 'São Paulo - SP',
        telefone: '(11) 66666-6666',
        email: 'ana@agroindustria.com',
        status: 'Ativo',
        avaliacao: 4.6
      }
    ];

    setTimeout(() => {
      setFretes(mockFretes);
      setUsuarios(mockUsuarios);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponível':
        return 'text-green-400 bg-green-900/20';
      case 'em_transito':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'concluído':
        return 'text-blue-400 bg-blue-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponível':
        return 'Disponível';
      case 'em_transito':
        return 'Em Trânsito';
      case 'concluído':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            AgroConecta
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sistema de fretes agrícolas que conecta caminhoneiros, produtores, 
            vendedores e compradores do agronegócio brasileiro.
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-10 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setActiveTab('fretes')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'fretes'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Fretes Disponíveis
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'usuarios'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Usuários Cadastrados
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              <p className="mt-4 text-gray-400">Carregando dados...</p>
            </div>
          ) : (
            <>
              {activeTab === 'fretes' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">
                      Fretes Disponíveis
                    </h2>
                    <button className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors duration-300">
                      Publicar Fretes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {fretes.map(frete => (
                      <div key={frete.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {frete.origem} → {frete.destino}
                            </h3>
                            <p className="text-gray-400">{frete.produto} • {frete.peso}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(frete.status)}`}>
                            {getStatusText(frete.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-gray-400 text-sm">Valor:</span>
                            <p className="text-white font-semibold">{frete.valor}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Tipo:</span>
                            <p className="text-white">{frete.tipo}</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-400">Caminhoneiro</p>
                              <p className="text-white font-medium">{frete.caminhoneiro}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Contato</p>
                              <p className="text-white">{frete.telefone}</p>
                              <p className="text-white text-sm">{frete.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'usuarios' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">
                      Usuários Cadastrados
                    </h2>
                    <button className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors duration-300">
                      Cadastrar Usuário
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {usuarios.map(usuario => (
                      <div key={usuario.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {usuario.nome}
                            </h3>
                            <p className="text-gray-400">{usuario.tipo}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-white">{usuario.avaliacao}</span>
                            </div>
                            <span className="text-green-400 text-sm">{usuario.status}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span className="text-gray-400">{usuario.localizacao}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span className="text-gray-400">{usuario.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                              <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span className="text-gray-400">{usuario.email}</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                          <button className="w-full px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-300">
                            Entrar em Contato
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-900 to-orange-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Quer se cadastrar no AgroConecta?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Conecte-se com o maior sistema de fretes agrícolas do Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-yellow-900 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300">
              Cadastrar Agora
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-yellow-900 transition-colors duration-300">
              Ver Tipos de Usuário
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgroConecta;
