import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, Building, Truck, ShoppingCart, Package, MapPin, Phone, Mail,
  FileText, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Check
} from 'lucide-react';

const Cadastro = () => {
  const { isDark } = useTheme();
  const [selectedModule, setSelectedModule] = useState('loja');
  const [selectedType, setSelectedType] = useState('vendedor');
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    
    // Endereço
    cep: '',
    estado: '',
    cidade: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    
    // Dados específicos
    empresa: '',
    razaoSocial: '',
    inscricaoEstadual: '',
    areaAtuacao: '',
    
    // Dados de transporte (AgroConecta)
    placa: '',
    tipoVeiculo: '',
    capacidade: '',
    documentos: []
  });

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Tipos de veículo para AgroConecta
  const tiposVeiculo = [
    'Graneleiro',
    'Bitrem',
    'Baú',
    'Refrigerado',
    'Tanque',
    'Carreta',
    'Truck',
    'Prancha',
    'Cegonha'
  ];

  // Áreas de atuação para Loja
  const areasAtuacao = [
    'Insumos Agrícolas',
    'Máquinas e Implementos',
    'Pecuária',
    'Commodities',
    'Serviços Agrícolas',
    'Tecnologia Agrícola',
    'Consultoria',
    'Manutenção'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
      if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
      if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Senhas não coincidem';
      }
    }

    if (step === 2) {
      if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
      if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
      if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
      if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    }

    if (step === 3) {
      if (selectedModule === 'loja' && selectedType === 'vendedor') {
        if (!formData.empresa.trim()) newErrors.empresa = 'Nome da empresa é obrigatório';
        if (!formData.areaAtuacao) newErrors.areaAtuacao = 'Área de atuação é obrigatória';
      }
      
      if (selectedModule === 'agroconecta') {
        if (!formData.placa.trim()) newErrors.placa = 'Placa é obrigatória';
        if (!formData.tipoVeiculo) newErrors.tipoVeiculo = 'Tipo de veículo é obrigatório';
        if (!formData.capacidade.trim()) newErrors.capacidade = 'Capacidade é obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sucesso
      alert('Cadastro realizado com sucesso!');
      // Aqui você redirecionaria para login ou dashboard
      
    } catch (error) {
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getModuleInfo = () => {
    if (selectedModule === 'loja') {
      return {
        title: 'Loja AgroSync',
        subtitle: 'Cadastre-se para vender ou comprar produtos agrícolas',
        icon: <ShoppingCart className="w-8 h-8" />,
        color: 'from-green-500 to-blue-500'
      };
    } else {
      return {
        title: 'AgroConecta',
        subtitle: 'Cadastre-se para conectar sua transportadora aos melhores fretes',
        icon: <Truck className="w-8 h-8" />,
        color: 'from-blue-500 to-purple-500'
      };
    }
  };

  const getTypeInfo = () => {
    if (selectedModule === 'loja') {
      return selectedType === 'vendedor' 
        ? { title: 'Vendedor', description: 'Venda seus produtos agrícolas' }
        : { title: 'Cliente', description: 'Compre produtos de qualidade' };
    } else {
      return { title: 'Transportadora', description: 'Conecte-se aos melhores fretes' };
    }
  };

  const moduleInfo = getModuleInfo();
  const typeInfo = getTypeInfo();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {isDark ? (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
              <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50">
              <div className="absolute inset-0 bg-white opacity-90"></div>
            </div>
          )}
        </div>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          >
            Cadastro AgroSync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Junte-se à maior plataforma do agronegócio brasileiro
          </motion.p>
        </div>
      </section>

      {/* Module and Type Selection */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Module Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                Escolha seu Módulo
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loja AgroSync */}
                <button
                  onClick={() => setSelectedModule('loja')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedModule === 'loja'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Loja AgroSync</h3>
                    <p className="text-gray-600 text-sm">
                      Marketplace para produtos agrícolas
                    </p>
                  </div>
                </button>

                {/* AgroConecta */}
                <button
                  onClick={() => setSelectedModule('agroconecta')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedModule === 'agroconecta'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <Truck className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AgroConecta</h3>
                    <p className="text-gray-600 text-sm">
                      Plataforma de fretes agrícolas
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Type Selection (only for Loja) */}
            {selectedModule === 'loja' && (
              <div>
                <h3 className="text-xl font-bold text-center mb-6 text-gray-900">
                  Tipo de Cadastro
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => setSelectedType('vendedor')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedType === 'vendedor'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Vendedor</h4>
                      <p className="text-sm text-gray-600">Venda seus produtos</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedType('cliente')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedType === 'cliente'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Cliente</h4>
                      <p className="text-sm text-gray-600">Compre produtos</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${moduleInfo.color} text-white mb-6`}>
                {moduleInfo.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {moduleInfo.title} - {typeInfo.title}
              </h2>
              <p className="text-gray-600">{typeInfo.description}</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    stepNumber <= step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber < step ? <Check className="w-5 h-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Dados Pessoais */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Dados Pessoais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.nome ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Seu nome completo"
                      />
                      {errors.nome && (
                        <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF/CNPJ *
                      </label>
                      <input
                        type="text"
                        name="cpfCnpj"
                        value={formData.cpfCnpj}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.cpfCnpj ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      />
                      {errors.cpfCnpj && (
                        <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone/WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.telefone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(00) 00000-0000"
                      />
                      {errors.telefone && (
                        <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="senha"
                          value={formData.senha}
                          onChange={handleInputChange}
                          className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.senha ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.senha && (
                        <p className="text-red-500 text-sm mt-1">{errors.senha}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Senha *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmarSenha"
                          value={formData.confirmarSenha}
                          onChange={handleInputChange}
                          className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmarSenha && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Endereço */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Endereço
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.cep ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.cep && (
                        <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.estado ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o estado</option>
                        {estados.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                      {errors.estado && (
                        <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.cidade ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da cidade"
                      />
                      {errors.cidade && (
                        <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço *
                      </label>
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.endereco ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Rua, Avenida, etc."
                      />
                      {errors.endereco && (
                        <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Número"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Apto, sala, etc."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Dados Específicos */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedModule === 'loja' && selectedType === 'vendedor' 
                      ? 'Dados da Empresa' 
                      : selectedModule === 'agroconecta' 
                        ? 'Dados do Veículo' 
                        : 'Dados Adicionais'
                    }
                  </h3>

                  {selectedModule === 'loja' && selectedType === 'vendedor' ? (
                    /* Dados da Empresa para Vendedor */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome da Empresa *
                        </label>
                        <input
                          type="text"
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.empresa ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nome da empresa ou fazenda"
                        />
                        {errors.empresa && (
                          <p className="text-red-500 text-sm mt-1">{errors.empresa}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Razão Social
                        </label>
                        <input
                          type="text"
                          name="razaoSocial"
                          value={formData.razaoSocial}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Razão social (se aplicável)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Inscrição Estadual
                        </label>
                        <input
                          type="text"
                          name="inscricaoEstadual"
                          value={formData.inscricaoEstadual}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Inscrição estadual"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Área de Atuação *
                        </label>
                        <select
                          name="areaAtuacao"
                          value={formData.areaAtuacao}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.areaAtuacao ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Selecione a área</option>
                          {areasAtuacao.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        {errors.areaAtuacao && (
                          <p className="text-red-500 text-sm mt-1">{errors.areaAtuacao}</p>
                        )}
                      </div>
                    </div>
                  ) : selectedModule === 'agroconecta' ? (
                    /* Dados do Veículo para AgroConecta */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Placa do Veículo *
                        </label>
                        <input
                          type="text"
                          name="placa"
                          value={formData.placa}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.placa ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="ABC-1234 ou ABC1D23"
                        />
                        {errors.placa && (
                          <p className="text-red-500 text-sm mt-1">{errors.placa}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Veículo *
                        </label>
                        <select
                          name="tipoVeiculo"
                          value={formData.tipoVeiculo}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.tipoVeiculo ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Selecione o tipo</option>
                          {tiposVeiculo.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                        {errors.tipoVeiculo && (
                          <p className="text-red-500 text-sm mt-1">{errors.tipoVeiculo}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacidade *
                        </label>
                        <input
                          type="text"
                          name="capacidade"
                          value={formData.capacidade}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.capacidade ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Ex: 30 toneladas, 1000 sacas"
                        />
                        {errors.capacidade && (
                          <p className="text-red-500 text-sm mt-1">{errors.capacidade}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Documentos do Veículo
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            Arraste documentos ou clique para selecionar
                          </p>
                          <p className="text-sm text-gray-500">
                            DUT, CRV, CRLV, etc. (opcional)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dados adicionais para clientes */
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Dados Completos!
                      </h4>
                      <p className="text-gray-600">
                        Seus dados pessoais e endereço foram preenchidos com sucesso.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Voltar
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processando...
                      </>
                    ) : (
                      'Finalizar Cadastro'
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Cadastro;
