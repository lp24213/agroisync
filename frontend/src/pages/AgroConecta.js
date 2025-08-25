import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, MessageCircle, User, Plus, Edit, Trash, 
  Eye, Route, CreditCard, Settings, LogOut, Bell, MapPin
} from 'lucide-react';

const AgroConecta = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('freights');
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [userFreights, setUserFreights] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newFreight, setNewFreight] = useState({
    origin: '',
    destination: '',
    weight: '',
    price: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    if (user && !isAdmin) {
      // Carregar dados do usuário
      loadUserData();
    }
  }, [user, isAdmin]);

  const loadUserData = async () => {
    try {
      // Simular carregamento de dados do usuário
      setUserFreights([
        {
          id: 1,
          origin: 'Cuiabá, MT',
          destination: 'São Paulo, SP',
          weight: '20 ton',
          price: 2500.00,
          date: '2024-01-20',
          status: 'Ativo'
        },
        {
          id: 2,
          origin: 'Goiânia, GO',
          destination: 'Brasília, DF',
          weight: '15 ton',
          price: 1800.00,
          date: '2024-01-25',
          status: 'Ativo'
        }
      ]);

      setUserMessages([
        {
          id: 1,
          from: 'Maria Santos',
          subject: 'Consulta sobre frete Cuiabá-SP',
          content: 'Gostaria de saber mais detalhes...',
          date: '2024-01-15',
          unread: true
        }
      ]);

      setUserProfile({
        name: user.name,
        email: user.email,
        phone: '(66) 99236-2830',
        address: 'Cuiabá, MT',
        plan: 'Frete Premium',
        vehicle: 'Truck 3/4'
      });

      setUserHistory([
        {
          id: 1,
          route: 'Cuiabá → São Paulo',
          price: 2500.00,
          date: '2024-01-10',
          status: 'Concluído'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleAddFreight = () => {
    if (newFreight.origin && newFreight.destination && newFreight.price) {
      const freight = {
        id: Date.now(),
        ...newFreight,
        price: parseFloat(newFreight.price),
        status: 'Ativo'
      };
      setUserFreights([...userFreights, freight]);
      setNewFreight({ origin: '', destination: '', weight: '', price: '', date: '', description: '' });
    }
  };

  const handleDeleteFreight = (freightId) => {
    setUserFreights(userFreights.filter(f => f.id !== freightId));
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Aqui você implementaria a lógica para salvar no backend
  };

  const toggleSecretPanel = () => {
    setShowSecretPanel(!showSecretPanel);
  };

  // Se não estiver logado, mostrar apenas os fretes públicos
  if (!user || isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white">
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AgroConecta - Sistema de Fretes
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Fretes mock para demonstração */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-green-500/50 transition-all duration-300">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <Truck className="w-16 h-16 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Frete {item}</h3>
                  <p className="text-neutral-400 mb-2">Cuiabá, MT → São Paulo, SP</p>
                  <p className="text-neutral-400 mb-4">20 ton • Disponível</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">R$ {(item * 500 + 1500).toFixed(2)}</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
        </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuário logado - mostrar fretes + painel secreto
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header com botão do painel secreto */}
      <div className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AgroConecta - Sistema de Fretes</h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSecretPanel}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>Meu Painel</span>
                {showSecretPanel && <span className="ml-2">←</span>}
              </button>
              
              <div className="relative">
                <Bell className="w-6 h-6 text-yellow-400 cursor-pointer" />
                {userMessages.filter(m => m.unread).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {userMessages.filter(m => m.unread).length}
                  </span>
          )}
        </div>
            </div>
        </div>
              </div>
            </div>

      <div className="flex">
        {/* Painel Secreto (lado esquerdo) */}
        {showSecretPanel && (
          <div className="w-80 bg-neutral-800 border-r border-neutral-700 min-h-screen">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-blue-400">Painel Secreto</h2>
              
              {/* Tabs do painel */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('freights')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'freights' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Fretes
                </button>
              <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'messages' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Mensagens
              </button>
              <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  Perfil
              </button>
            </div>

              {/* Conteúdo das tabs */}
          <div className="space-y-6">
                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                  <div>
                    <div className="bg-neutral-700 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold mb-2">Resumo</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-400">Fretes Ativos</p>
                          <p className="text-xl font-bold text-blue-400">{userFreights.length}</p>
                        </div>
                        <div>
                          <p className="text-neutral-400">Mensagens</p>
                          <p className="text-xl font-bold text-green-400">{userMessages.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-700 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Atividade Recente</h3>
                      <div className="space-y-2 text-sm">
                        <p>• Novo frete adicionado: Cuiabá → São Paulo</p>
                        <p>• Mensagem recebida de Maria Santos</p>
                        <p>• Frete concluído: R$ 2.500,00</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fretes */}
                {activeTab === 'freights' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Meus Fretes</h3>
                      <button className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                      </div>

                    <div className="space-y-3">
                      {userFreights.map((freight) => (
                        <div key={freight.id} className="bg-neutral-700 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{freight.origin} → {freight.destination}</h4>
                              <p className="text-sm text-neutral-400">{freight.weight} • {freight.date}</p>
                              <p className="text-sm text-blue-400">R$ {freight.price.toFixed(2)}</p>
                        </div>
                        <div className="flex space-x-2">
                              <button className="p-1 bg-blue-600 rounded hover:bg-blue-700">
                                <Edit className="w-3 h-3" />
                          </button>
                              <button 
                                onClick={() => handleDeleteFreight(freight.id)}
                                className="p-1 bg-red-600 rounded hover:bg-red-700"
                              >
                                <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensagens */}
                {activeTab === 'messages' && (
                  <div>
                    <h3 className="font-semibold mb-4">Minhas Mensagens</h3>
                    <div className="space-y-3">
                      {userMessages.map((message) => (
                        <div key={message.id} className={`bg-neutral-700 rounded-lg p-3 cursor-pointer hover:bg-neutral-600 transition-colors ${
                          message.unread ? 'border-l-4 border-green-500' : ''
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{message.from}</h4>
                              <p className="text-sm text-neutral-400">{message.subject}</p>
                              <p className="text-xs text-neutral-500">{message.date}</p>
                            </div>
                            {message.unread && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                  </div>
                </div>
            ))}
          </div>
            </div>
          )}

                {/* Perfil */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Meu Perfil</h3>
              <button 
                        onClick={handleEditProfile}
                        className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                        {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-neutral-400">Nome</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.name || ''} 
                            className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium">{userProfile?.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-neutral-400">Email</label>
                        <p className="font-medium">{userProfile?.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-neutral-400">Telefone</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.phone || ''} 
                            className="w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium">{userProfile?.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-neutral-400">Veículo</label>
                        <p className="font-medium text-blue-400">{userProfile?.vehicle}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-neutral-400">Plano</label>
                        <p className="font-medium text-green-400">{userProfile?.plan}</p>
                      </div>
                      
                      {isEditing && (
                        <button 
                          onClick={handleSaveProfile}
                          className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Salvar Alterações
                        </button>
                      )}
              </div>
            </div>
          )}
        </div>
            </div>
          </div>
        )}

        {/* Fretes (lado direito) */}
        <div className={`flex-1 ${showSecretPanel ? 'ml-0' : ''}`}>
          <main className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4">
              {!showSecretPanel && (
                <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  AgroConecta - Sistema de Fretes
                </h1>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fretes mock para demonstração */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 hover:border-blue-500/50 transition-all duration-300">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl mb-4 flex items-center justify-center">
                      <Truck className="w-16 h-16 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Frete {item}</h3>
                    <p className="text-neutral-400 mb-2">Cuiabá, MT → São Paulo, SP</p>
                    <p className="text-neutral-400 mb-4">20 ton • Disponível</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">R$ {(item * 500 + 1500).toFixed(2)}</span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgroConecta;
