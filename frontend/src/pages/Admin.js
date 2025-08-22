import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });
  const [stats, setStats] = useState({
    usuarios: 0,
    cotacoes: 0,
    cadastros: 0,
    anuncios: 0
  });

  // Credenciais especificadas
  const ADMIN_CREDENTIALS = {
    email: 'luispaulodeoliveira@agrotm.com.br',
    senha: 'Th@ys15221008'
  };

  // Dados simulados para o dashboard
  useEffect(() => {
    if (isLoggedIn) {
      setStats({
        usuarios: 1247,
        cotacoes: 8934,
        cadastros: 2156,
        anuncios: 3421
      });
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginData.email === ADMIN_CREDENTIALS.email && 
        loginData.senha === ADMIN_CREDENTIALS.senha) {
      setIsLoggedIn(true);
      alert('Login realizado com sucesso!');
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ email: '', senha: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        {/* Login Section */}
        <section className="py-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h1 className="text-3xl font-bold text-center mb-8 text-white">
                Área Administrativa
              </h1>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Administrativo
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    placeholder="admin@agroisync.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={loginData.senha}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    placeholder="Digite sua senha"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                >
                  Acessar Admin
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Acesso restrito a administradores autorizados
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Admin Header */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-900/20 to-orange-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Painel Admin
              </h1>
              <p className="text-xl text-gray-300">
                Gerenciamento completo da plataforma AGROSYNC
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Sair
            </button>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-10 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Estatísticas Gerais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Usuários</p>
                  <p className="text-3xl font-bold text-white">{stats.usuarios.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Cotações</p>
                  <p className="text-3xl font-bold text-white">{stats.cotacoes.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10"/>
                    <line x1="18" y1="20" x2="18" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="16"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Cadastros</p>
                  <p className="text-3xl font-bold text-white">{stats.cadastros.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Anúncios</p>
                  <p className="text-3xl font-bold text-white">{stats.anuncios.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Sections */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Gerenciamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Usuários</h3>
              <p className="text-gray-400">Gerenciar contas e permissões</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Cotações</h3>
              <p className="text-gray-400">Monitorar preços e tendências</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Cadastros</h3>
              <p className="text-gray-400">Aprovar novos usuários</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Anúncios</h3>
              <p className="text-gray-400">Moderar marketplace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Adicionar Usuário</h3>
              <p className="text-gray-400">Criar nova conta administrativa</p>
            </button>
            
            <button className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Aprovar Cadastros</h3>
              <p className="text-gray-400">Revisar pendências</p>
            </button>
            
            <button className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 border border-gray-700">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Relatórios</h3>
              <p className="text-gray-400">Gerar análises e métricas</p>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
