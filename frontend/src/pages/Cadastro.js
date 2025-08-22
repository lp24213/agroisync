import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cadastro = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipoUsuario: 'produtor',
    cpfCnpj: '',
    localizacao: '',
    empresa: ''
  });

  const tiposUsuario = [
    { id: 'produtor', nome: 'Produtor', descricao: 'Agricultor que produz commodities' },
    { id: 'comprador', nome: 'Comprador', descricao: 'Empresa que compra produtos agrícolas' },
    { id: 'vendedor', nome: 'Vendedor', descricao: 'Intermediário na venda de produtos' },
    { id: 'freteiro', nome: 'Freteiro', descricao: 'Transportador de cargas agrícolas' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Lógica de login
      console.log('Tentando fazer login:', { email: formData.email, senha: formData.senha });
      alert('Funcionalidade de login em desenvolvimento');
    } else {
      // Lógica de cadastro
      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }
      
      console.log('Dados do cadastro:', formData);
      alert('Cadastro realizado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 to-green-900/20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
            {isLogin ? 'Login' : 'Cadastro'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {isLogin 
              ? 'Acesse sua conta para gerenciar produtos, fretes e cotações'
              : 'Crie sua conta e comece a usar todas as funcionalidades do AGROSYNC'
            }
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            {/* Toggle Login/Cadastro */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    !isLogin
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Cadastro
                </button>
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isLogin
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Login
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  {/* Tipo de Usuário */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Usuário
                    </label>
                    <select
                      name="tipoUsuario"
                      value={formData.tipoUsuario}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {tiposUsuario.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome} - {tipo.descricao}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CPF/CNPJ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CPF ou CNPJ
                    </label>
                    <input
                      type="text"
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Digite seu CPF ou CNPJ"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  {/* Localização */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localização
                    </label>
                    <input
                      type="text"
                      name="localizacao"
                      value={formData.localizacao}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Cidade - Estado"
                    />
                  </div>

                  {/* Empresa (opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome da Empresa (opcional)
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      placeholder="Digite o nome da sua empresa"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Digite sua senha"
                />
              </div>

              {/* Confirmar Senha (apenas no cadastro) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Confirme sua senha"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </button>
            </form>

            {/* Links Adicionais */}
            <div className="mt-8 text-center">
              {isLogin ? (
                <p className="text-gray-400">
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              ) : (
                <p className="text-gray-400">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Faça login aqui
                  </button>
                </p>
              )}
            </div>

            {/* Recuperar Senha */}
            {isLogin && (
              <div className="mt-4 text-center">
                <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Esqueceu sua senha?
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Por que se cadastrar no AGROSYNC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Geolocalização</h3>
              <p className="text-gray-400">Preços baseados na sua localização real</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Marketplace</h3>
              <p className="text-gray-400">Anuncie e compre produtos agrícolas</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L8 8l4 4 4-4-4-6z"/>
                  <path d="M8 8v8a4 4 0 0 0 8 0V8"/>
                  <path d="M6 16h12"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Fretes</h3>
              <p className="text-gray-400">Sistema completo de logística agrícola</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cadastro;
