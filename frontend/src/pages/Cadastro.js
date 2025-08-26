import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  User, Building, Truck, ShoppingCart, Eye, EyeOff, 
  AlertCircle, CheckCircle, MapPin, CreditCard, FileText
} from 'lucide-react';

const Cadastro = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [userType, setUserType] = useState('');
  const [userCategory, setUserCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dados do formulário
  const [formData, setFormData] = useState({
    // Dados básicos
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    cnpj: '',
    inscricaoEstadual: '',
    
    // Localização
    address: '',
    city: '',
    state: '',
    zipCode: '',
    number: '',
    
    // Dados específicos por tipo
    companyName: '',
    businessType: '',
    
    // Dados do veículo (para freteiro)
    vehiclePlate: '',
    vehicleType: '',
    vehicleAxles: '',
    vehicleCapacity: '',
    
    // Dados de negócio
    businessDescription: '',
    specialties: [],
    serviceAreas: []
  });

  // Estados de validação
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Opções para tipos de usuário
  const userTypes = [
    { id: 'anunciante', name: '📢 Anunciante', description: 'Vender produtos no marketplace' },
    { id: 'comprador', name: '🛍️ Comprador', description: 'Comprar produtos agrícolas' },
    { id: 'freteiro', name: '🚛 Freteiro', description: 'Oferecer serviços de transporte' }
  ];

  // Atualizar categoria quando tipo de usuário muda
  useEffect(() => {
    setUserCategory('');
    setFormData(prev => ({
      ...prev,
      companyName: '',
      businessType: '',
      vehiclePlate: '',
      vehicleType: '',
      vehicleAxles: '',
      vehicleCapacity: '',
      businessDescription: '',
      specialties: [],
      serviceAreas: []
    }));
  }, [userType]);

  // Validar CPF
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    // Verificar dígitos repetidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 2 ? 0 : remainder;
    
    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 2 ? 0 : remainder;
    
    return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
  };

  // Validar CNPJ
  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    
    // Verificar dígitos repetidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar primeiro dígito verificador
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    // Validar segundo dígito verificador
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2;
  };

  // Validar CEP
  const validateCEP = (cep) => {
    cep = cep.replace(/\D/g, '');
    return cep.length === 8;
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validações básicas
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';

    // Validações específicas por tipo
    if (userType === 'anunciante') {
        if (!formData.companyName.trim()) newErrors.companyName = 'Nome da empresa é obrigatório';
      if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
      if (formData.cnpj.trim() && !validateCNPJ(formData.cnpj)) newErrors.cnpj = 'CNPJ inválido';
      if (!formData.inscricaoEstadual.trim()) newErrors.inscricaoEstadual = 'Inscrição Estadual é obrigatória';
        if (!formData.businessType.trim()) newErrors.businessType = 'Tipo de negócio é obrigatório';
    } else if (userType === 'comprador') {
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        if (formData.cpf.trim() && !validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    } else if (userType === 'freteiro') {
        if (!formData.cpf.trim() && !formData.cnpj.trim()) {
          newErrors.cpf = 'CPF ou CNPJ é obrigatório';
        }
        if (formData.cpf.trim() && !validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
        if (formData.cnpj.trim() && !validateCNPJ(formData.cnpj)) newErrors.cnpj = 'CNPJ inválido';
        if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = 'Placa do veículo é obrigatória';
        if (!formData.vehicleType.trim()) newErrors.vehicleType = 'Tipo de veículo é obrigatório';
        if (!formData.vehicleAxles.trim()) newErrors.vehicleAxles = 'Número de eixos é obrigatório';
    }

    // Validações de localização
    if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
    if (formData.zipCode.trim() && !validateCEP(formData.zipCode)) newErrors.zipCode = 'CEP inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Buscar CEP
  const fetchCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || '',
            city: data.localidade || '',
            state: data.uf || '',
            zipCode: cep
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Lidar com mudanças no formulário
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Marcar campo como tocado
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Buscar CEP automaticamente
    if (field === 'zipCode' && value.length === 8) {
      fetchCEP(value);
    }
  };

  // Lidar com envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userType) {
      setError('Selecione o tipo de usuário');
      return;
    }

    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Preparar dados para registro
      const registrationData = {
        ...formData,
        userType,
        registrationDate: new Date().toISOString(),
        status: 'pending', // Aguardando pagamento
        freeProductLimit: userType === 'comprador' ? 3 : null, // Limite de produtos gratuitos para compradores
        productsConsumed: 0 // Contador de produtos consumidos
      };

      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando...');
        
        // Redirecionar baseado no tipo de usuário
        setTimeout(() => {
          if (userType === 'anunciante') {
            navigate('/panel/loja');
          } else if (userType === 'comprador') {
            navigate('/dashboard');
          } else if (userType === 'freteiro') {
            navigate('/panel/agroconecta');
          }
        }, 2000);
      } else {
        setError(result.message || 'Erro no cadastro');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar campos específicos por tipo
  const renderTypeFields = () => {
    if (!userType) return null;

    if (userType === 'anunciante') {
        return (
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-600 mb-4">📢 Dados do Anunciante</h3>
            
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa *
        </label>
        <input
          type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nome da sua empresa"
              />
            {errors.companyName && <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>}
      </div>

          <div className="grid md:grid-cols-2 gap-4">
      <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ *
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleChange('cnpj', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cnpj ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="00.000.000/0000-00"
                maxLength="18"
              />
              {errors.cnpj && <p className="text-red-600 text-sm mt-1">{errors.cnpj}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inscrição Estadual *
              </label>
              <input
                type="text"
                value={formData.inscricaoEstadual}
                onChange={(e) => handleChange('inscricaoEstadual', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.inscricaoEstadual ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000.000.000"
              />
              {errors.inscricaoEstadual && <p className="text-red-600 text-sm mt-1">{errors.inscricaoEstadual}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Negócio *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.businessType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o tipo</option>
                <option value="produtor">Produtor Rural</option>
                <option value="distribuidor">Distribuidor</option>
                <option value="varejista">Varejista</option>
                <option value="atacadista">Atacadista</option>
                <option value="outro">Outro</option>
              </select>
            {errors.businessType && <p className="text-red-600 text-sm mt-1">{errors.businessType}</p>}
            </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-700 mb-2">💡 Como Anunciante</h4>
            <ul className="text-sm text-green-600 space-y-1">
                <li>• Cadastre produtos completos (nome, descrição, preço, imagens)</li>
                <li>• Dados pessoais permanecem privados até pagamento</li>
                <li>• Acesso total ao painel após confirmação de pagamento</li>
                <li>• Sistema de mensagens integrado para negociações</li>
              </ul>
            </div>
          </div>
        );
    } else if (userType === 'comprador') {
        return (
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">🛍️ Dados do Comprador</h3>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cpf ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000.000.000-00"
                maxLength="14"
              />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
            </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-700 mb-2">🎁 Plano Gratuito</h4>
            <ul className="text-sm text-blue-600 space-y-1">
                <li>• <strong>3 produtos gratuitos</strong> para visualização completa</li>
                <li>• 1 produto é consumido a cada interesse/mensagem</li>
                <li>• Após atingir o limite, acesso somente com pagamento</li>
                <li>• Dados básicos: nome, CPF, localização</li>
              </ul>
            </div>
          </div>
        );
    } else if (userType === 'freteiro') {
        return (
          <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-600 mb-4">🚛 Dados do Freteiro</h3>
            
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF ou CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.cpf || formData.cnpj}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 14) {
                      handleChange('cpf', value);
                      handleChange('cnpj', '');
                    } else {
                      handleChange('cnpj', value);
                      handleChange('cpf', '');
                    }
                  }}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.cpf && errors.cnpj ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="CPF ou CNPJ"
                />
              {(errors.cpf || errors.cnpj) && <p className="text-red-600 text-sm mt-1">{errors.cpf || errors.cnpj}</p>}
      </div>

      <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa do Veículo *
        </label>
        <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) => handleChange('vehiclePlate', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.vehiclePlate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ABC-1234"
                  maxLength="8"
                />
              {errors.vehiclePlate && <p className="text-red-600 text-sm mt-1">{errors.vehiclePlate}</p>}
              </div>
            </div>

          <div className="grid md:grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Veículo *
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleChange('vehicleType', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="truck">Truck</option>
                  <option value="truck_3_4">Truck 3/4</option>
                  <option value="truck_toco">Truck Toco</option>
                  <option value="carreta">Carreta</option>
                  <option value="carreta_ls">Carreta LS</option>
                  <option value="bitruck">Bitruck</option>
                  <option value="bitrem">Bitrem</option>
                  <option value="rodotrem">Rodotrem</option>
                </select>
              {errors.vehicleType && <p className="text-red-600 text-sm mt-1">{errors.vehicleType}</p>}
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Eixos *
                </label>
                <select
                  value={formData.vehicleAxles}
                  onChange={(e) => handleChange('vehicleAxles', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.vehicleAxles ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="2">2 Eixos</option>
                  <option value="3">3 Eixos</option>
                  <option value="4">4 Eixos</option>
                  <option value="5">5 Eixos</option>
                  <option value="6">6 Eixos</option>
                  <option value="7">7 Eixos</option>
                  <option value="8">8 Eixos</option>
                  <option value="9">9 Eixos</option>
                </select>
              {errors.vehicleAxles && <p className="text-red-600 text-sm mt-1">{errors.vehicleAxles}</p>}
              </div>
            </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-700 mb-2">🔒 Privacidade dos Dados</h4>
            <ul className="text-sm text-orange-600 space-y-1">
                <li>• <strong>Públicos:</strong> Cidade de destino e valor do frete</li>
                <li>• <strong>Privados:</strong> Dados pessoais, veículo, CPF/CNPJ</li>
                <li>• Dados privados liberados após pagamento no painel individual</li>
                <li>• Sistema de mensagens para negociações</li>
              </ul>
            </div>
          </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">A</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Cadastro AgroSync
            </h1>
            <p className="text-gray-600">
              Escolha seu tipo de usuário e preencha os dados necessários
            </p>
          </div>

          {/* Seleção de Tipo de Usuário */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">1️⃣ Escolha o Tipo de Usuário</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setUserType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    userType === type.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <h3 className="font-semibold mb-1 text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de Cadastro */}
          {userType && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">2️⃣ Dados de Cadastro</h2>

              {/* Dados Básicos */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Dados Básicos</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
        </label>
        <input
          type="email"
          value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
          placeholder="seu@email.com"
        />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
      </div>

                <div className="grid md:grid-cols-2 gap-4">
      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
          </button>
        </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Senha *
        </label>
          <input
                      type="password"
            value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

              {/* Dados Específicos por Tipo */}
              <div className="mb-8">
                {renderTypeFields()}
        </div>

              {/* Localização */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Localização</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
              <input
                type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="00000-000"
                      maxLength="8"
                    />
                    {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
            </div>
            
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => handleChange('number', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.number ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Número"
                    />
                    {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
              <input
                type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Rua, complemento"
                    />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
            
                <div className="grid md:grid-cols-2 gap-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
              <input
                type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Sua cidade"
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>
            </div>
          </div>
          
              {/* Mensagens de erro/sucesso */}
              {error && (
        <motion.div
                  initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
        </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </motion.div>
              )}

              {/* Botão de Envio */}
            <button
                type="submit"
              disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  <span>Finalizar Cadastro</span>
              )}
            </button>

              {/* Informações Adicionais */}
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Já tem uma conta? </p>
                <a 
                  href="/login" 
                  className="text-green-600 hover:text-green-700 transition-colors font-medium"
                >
                  Faça login aqui
                </a>
              </div>
            </form>
          )}

          {/* Resumo das Funcionalidades */}
          {userType && (
            <div className="bg-white rounded-2xl p-6 mt-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">🎯 O que você terá acesso:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-600 mb-2">💬 Sistema de Mensagens</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Painel de mensagens pessoal</li>
                    <li>• Conversas com outros usuários</li>
                    <li>• Notificações em tempo real</li>
                    <li>• Histórico completo de comunicação</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">🕵️ Painel Privado</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Controle de produtos ou fretes</li>
                    <li>• Dados pessoais e de negócio</li>
                    <li>• Histórico de atividades</li>
                    <li>• Configurações de privacidade</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-700 mb-2">⚠️ Importante</h4>
                <p className="text-sm text-yellow-700">
                  Após o cadastro, você será redirecionado para a área correspondente. 
                  O acesso completo aos painéis privados será liberado após a confirmação de pagamento.
                </p>
              </div>
          </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
