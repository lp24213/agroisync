import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, MessageCircle, User, Plus, Edit, Trash, 
  Eye, Route, CreditCard, Settings, LogOut, Bell, MapPin,
  Lock, Package
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
  const [freights, setFreights] = useState([]);
  const [loadingFreights, setLoadingFreights] = useState(true);
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
    // Carregar fretes públicos
    loadPublicFreights();
  }, [user, isAdmin]);

  const loadUserData = async () => {
    try {
      // Carregar dados reais do usuário
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
        setUserFreights(data.freights || []);
        setUserMessages(data.messages || []);
        setUserHistory(data.history || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const loadPublicFreights = async () => {
    try {
      setLoadingFreights(true);
      // Carregar fretes públicos da API
      const response = await fetch('/api/freights/public');
      if (response.ok) {
        const data = await response.json();
        setFreights(data.freights || []);
      }
    } catch (error) {
      console.error('Erro ao carregar fretes:', error);
    } finally {
      setLoadingFreights(false);
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

  // PÁGINA PÚBLICA - mostrar para todos
  if (!user || isAdmin) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-slate-800 text-center">
              🚛 AgroConecta
            </h1>
            <p className="text-xl text-slate-600 mb-8 text-center">
              Plataforma de fretes e logística agropecuária
            </p>
            
            {/* Opções de Cadastro */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">📦 Anunciante de Frete</h3>
                <p className="text-slate-700 mb-6">
                  <strong>Campos obrigatórios:</strong> cidade origem, cidade destino, valor do frete, dados gerais (telefone, e-mail, localização, CPF/CNPJ).
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  <strong>Exibição pública:</strong> SOMENTE cidade destino + valor do frete. Dados privados liberados após login e pagamento.
                </p>
                <button 
                  onClick={() => window.location.href = '/cadastro?type=anunciante-frete'}
                  className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cadastrar como Anunciante
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">🚛 Freteiro</h3>
                <p className="text-slate-700 mb-6">
                  <strong>Campos obrigatórios:</strong> placa do caminhão, tipo de caminhão, nº de eixos, localização, CPF/CNPJ.
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  <strong>Exibição pública:</strong> SOMENTE nome do freteiro. Dados privados liberados após login e pagamento.
                </p>
                <button 
                  onClick={() => window.location.href = '/cadastro?type=freteiro'}
                  className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Cadastrar como Freteiro
                </button>
              </div>
            </div>
            
            {/* Fretes Públicos - apenas dados básicos */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">📋 Fretes Disponíveis (Dados Públicos)</h3>
              <p className="text-sm text-slate-600 mb-6 text-center">
                <strong>Regra de Privacidade:</strong> Apenas cidade destino e valor do frete são exibidos publicamente. 
                Dados pessoais (telefone, CPF/CNPJ, endereço) ficam ocultos até login e pagamento.
              </p>
              
              {loadingFreights ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Carregando fretes...</p>
                </div>
              ) : freights.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">Nenhum frete disponível</p>
                  <p className="text-sm text-slate-500 mt-2">Seja o primeiro a cadastrar um frete!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freights.map((freight) => (
                    <div key={freight.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-card">
                      <div className="w-full h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                        <Truck className="w-12 h-12 text-slate-600" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-slate-800">Frete {freight.id}</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p><strong>Destino:</strong> {freight.destination}</p>
                        <p><strong>Valor:</strong> R$ {freight.price.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 flex items-center justify-center">
                          <Lock className="w-3 h-3 mr-1" />
                          Dados completos disponíveis após login e pagamento
                        </p>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Usuário logado - mostrar fretes + painel secreto
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header com botão do painel secreto - DESIGN PREMIUM */}
      <div className="bg-slate-100 border-b-2 border-gradient-to-r from-agro-green to-agro-gold">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gradient-agro"
            >
              AgroConecta - Sistema de Fretes
            </motion.h1>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSecretPanel}
                className="btn-premium flex items-center space-x-2 px-4 py-2"
              >
                <User className="w-5 h-5" />
                <span>Meu Painel</span>
                {showSecretPanel && <span className="ml-2">←</span>}
              </motion.button>
              
              <div className="relative">
                <Bell className="w-6 h-6 text-amber-500 cursor-pointer" />
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
          <div className="w-80 bg-slate-50 border-r border-slate-200 min-h-screen">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Painel Privado</h2>
              
              {/* Tabs do painel */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('freights')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'freights' 
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Fretes
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'messages' 
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Mensagens
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                    <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-800">Resumo</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Fretes Ativos</p>
                          <p className="text-xl font-bold text-slate-800">{userFreights.length}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Mensagens</p>
                          <p className="text-xl font-bold text-slate-800">{userMessages.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h3 className="font-semibold mb-2 text-slate-800">Atividade Recente</h3>
                      <div className="space-y-2 text-sm text-slate-600">
                        {userHistory.length > 0 ? (
                          userHistory.slice(0, 3).map((item) => (
                            <p key={item.id}>• {item.description}</p>
                          ))
                        ) : (
                          <p className="text-slate-500">Nenhuma atividade recente</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fretes */}
                {activeTab === 'freights' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Meus Fretes</h3>
                      <button className="p-2 bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {userFreights.length > 0 ? (
                        userFreights.map((freight) => (
                          <div key={freight.id} className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">{freight.origin} → {freight.destination}</h4>
                                <p className="text-sm text-slate-500">{freight.weight} • {freight.date}</p>
                                <p className="text-sm text-slate-700">R$ {freight.price.toFixed(2)}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button className="p-1 bg-slate-600 rounded hover:bg-slate-700 text-white">
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteFreight(freight.id)}
                                  className="p-1 bg-red-600 rounded hover:bg-red-700 text-white"
                                >
                                  <Trash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p>Nenhum frete cadastrado</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mensagens */}
                {activeTab === 'messages' && (
                  <div>
                    <h3 className="font-semibold mb-4 text-slate-800">Minhas Mensagens</h3>
                    <div className="space-y-3">
                      {userMessages.length > 0 ? (
                        userMessages.map((message) => (
                          <div key={message.id} className={`bg-white rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors border border-slate-200 ${
                            message.unread ? 'border-l-4 border-slate-600' : ''
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-slate-800">{message.from}</h4>
                                <p className="text-sm text-slate-500">{message.subject}</p>
                                <p className="text-xs text-slate-400">{message.date}</p>
                              </div>
                              {message.unread && (
                                <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                          <p>Nenhuma mensagem</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Perfil */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">Meu Perfil</h3>
                      <button 
                        onClick={handleEditProfile}
                        className="px-3 py-1 bg-slate-600 rounded text-sm hover:bg-slate-700 transition-colors text-white"
                      >
                        {isEditing ? 'Cancelar' : 'Editar'}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-500">Nome</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.name || ''} 
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium text-slate-800">{userProfile?.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Email</label>
                        <p className="font-medium text-slate-800">{userProfile?.email}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Telefone</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={userProfile?.phone || ''} 
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="font-medium text-slate-800">{userProfile?.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Veículo</label>
                        <p className="font-medium text-slate-700">{userProfile?.vehicle}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-500">Plano</label>
                        <p className="font-medium text-slate-700">{userProfile?.plan}</p>
                      </div>
                      
                      {isEditing && (
                        <button 
                          onClick={handleSaveProfile}
                          className="w-full px-4 py-2 bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-white"
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
                <h1 className="text-5xl md:text-6xl font-bold mb-8 text-slate-800 text-center">
                  AgroConecta - Sistema de Fretes
                </h1>
              )}
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingFreights ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-slate-100 rounded-2xl p-6 border border-slate-200 animate-pulse">
                      <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded mb-4"></div>
                      <div className="h-6 bg-slate-200 rounded"></div>
                    </div>
                  ))
                ) : freights.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Truck className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 text-lg">Nenhum frete disponível</p>
                    <p className="text-slate-500">Cadastre-se para ver fretes disponíveis</p>
                  </div>
                ) : (
                  freights.map((freight) => (
                    <div key={freight.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-400 transition-all duration-300 shadow-card">
                      <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">
                        <Truck className="w-16 h-16 text-slate-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-800">Frete {freight.id}</h3>
                      <p className="text-slate-500 mb-2">{freight.origin} → {freight.destination}</p>
                      <p className="text-slate-500 mb-4">{freight.weight} • Disponível</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-800">R$ {freight.price.toFixed(2)}</span>
                        <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors text-white">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgroConecta;
