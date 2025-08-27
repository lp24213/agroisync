import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, FileText, MapPin, AlertCircle, CheckCircle, Building2, Leaf } from 'lucide-react';

const Cadastro = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    documentType: 'CPF',
    document: '',
    ie: '',
    cep: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    userType: 'loja',
    userCategory: 'anunciante'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    document.title = 'Cadastro - AgroSync';
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Limpar erro de validação do campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
      if (!formData.email.trim()) errors.email = 'Email é obrigatório';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Email inválido';
      if (!formData.password) errors.password = 'Senha é obrigatória';
      else if (formData.password.length < 6) errors.password = 'Senha deve ter pelo menos 6 caracteres';
      if (!formData.confirmPassword) errors.confirmPassword = 'Confirme sua senha';
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Senhas não coincidem';
    }
    
    if (step === 2) {
      if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
      if (!formData.document.trim()) errors.document = 'Documento é obrigatório';
      if (formData.documentType === 'CNPJ' && !formData.ie.trim()) errors.ie = 'Inscrição Estadual é obrigatória para CNPJ';
      if (!formData.cep.trim()) errors.cep = 'CEP é obrigatório';
      if (!formData.address.street.trim()) errors.street = 'Rua é obrigatória';
      if (!formData.address.number.trim()) errors.number = 'Número é obrigatório';
      if (!formData.address.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
      if (!formData.address.city.trim()) errors.city = 'Cidade é obrigatória';
      if (!formData.address.state.trim()) errors.state = 'Estado é obrigatório';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    clearError();

    if (!validateStep(currentStep)) {
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess(result.message);
      
      // Armazenar email para verificação
      if (result.requiresEmailVerification) {
        localStorage.setItem('pendingVerificationEmail', formData.email);
      }
      
      setTimeout(() => {
        if (result.requiresEmailVerification) {
          navigate('/verify-email');
        } else {
          navigate('/dashboard');
        }
      }, 2000);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] || error;
  };

  const states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header - DESIGN PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Leaf className="w-10 h-10 text-white" />
            </motion.div>
          </div>
          <h2 className="mt-6 text-4xl font-bold text-gradient-agro">
            Criar Conta
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            Junte-se à plataforma AgroSync e conecte-se ao agronegócio
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-slate-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-slate-600">
              {currentStep === 1 && 'Informações Básicas'}
              {currentStep === 2 && 'Dados Pessoais e Endereço'}
              {currentStep === 3 && 'Revisão e Confirmação'}
            </p>
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-card border border-slate-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Informações Básicas</h3>
                
                {/* Nome */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                        getFieldError('name') ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  {getFieldError('name') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                        getFieldError('email') ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                  </div>
                  {getFieldError('email') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                        getFieldError('password') ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                  {getFieldError('password') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                        getFieldError('confirmPassword') ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Dados Pessoais e Endereço */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Dados Pessoais e Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Telefone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('phone') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    {getFieldError('phone') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                    )}
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-slate-700 mb-2">
                      Tipo de Documento
                    </label>
                    <select
                      id="documentType"
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                    </select>
                  </div>

                  {/* Documento */}
                  <div>
                    <label htmlFor="document" className="block text-sm font-medium text-slate-700 mb-2">
                      {formData.documentType === 'CPF' ? 'CPF' : 'CNPJ'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="document"
                        name="document"
                        type="text"
                        required
                        value={formData.document}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('document') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder={formData.documentType === 'CPF' ? '123.456.789-00' : '12.345.678/0001-90'}
                      />
                    </div>
                    {getFieldError('document') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('document')}</p>
                    )}
                  </div>

                  {/* Inscrição Estadual (apenas para CNPJ) */}
                  {formData.documentType === 'CNPJ' && (
                    <div>
                      <label htmlFor="ie" className="block text-sm font-medium text-slate-700 mb-2">
                        Inscrição Estadual
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="ie"
                          name="ie"
                          type="text"
                          required
                          value={formData.ie}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                            getFieldError('ie') ? 'border-red-300' : 'border-slate-300'
                          }`}
                          placeholder="123.456.789"
                        />
                      </div>
                      {getFieldError('ie') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('ie')}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Endereço */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Endereço</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CEP */}
                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-slate-700 mb-2">
                        CEP
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="cep"
                          name="cep"
                          type="text"
                          required
                          value={formData.cep}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                            getFieldError('cep') ? 'border-red-300' : 'border-slate-300'
                          }`}
                          placeholder="12345-678"
                        />
                      </div>
                      {getFieldError('cep') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('cep')}</p>
                      )}
                    </div>

                    {/* Rua */}
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-slate-700 mb-2">
                        Rua
                      </label>
                      <input
                        id="street"
                        name="address.street"
                        type="text"
                        required
                        value={formData.address.street}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('street') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Nome da rua"
                      />
                      {getFieldError('street') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('street')}</p>
                      )}
                    </div>

                    {/* Número */}
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-slate-700 mb-2">
                        Número
                      </label>
                      <input
                        id="number"
                        name="address.number"
                        type="text"
                        required
                        value={formData.address.number}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('number') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="123"
                      />
                      {getFieldError('number') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('number')}</p>
                      )}
                    </div>

                    {/* Complemento */}
                    <div>
                      <label htmlFor="complement" className="block text-sm font-medium text-slate-700 mb-2">
                        Complemento
                      </label>
                      <input
                        id="complement"
                        name="address.complement"
                        type="text"
                        value={formData.address.complement}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Apto, sala, etc. (opcional)"
                      />
                    </div>

                    {/* Bairro */}
                    <div>
                      <label htmlFor="neighborhood" className="block text-sm font-medium text-slate-700 mb-2">
                        Bairro
                      </label>
                      <input
                        id="neighborhood"
                        name="address.neighborhood"
                        type="text"
                        required
                        value={formData.address.neighborhood}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('neighborhood') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Nome do bairro"
                      />
                      {getFieldError('neighborhood') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('neighborhood')}</p>
                      )}
                    </div>

                    {/* Cidade */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                        Cidade
                      </label>
                      <input
                        id="city"
                        name="address.city"
                        type="text"
                        required
                        value={formData.address.city}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('city') ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Nome da cidade"
                      />
                      {getFieldError('city') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                        Estado
                      </label>
                      <select
                        id="state"
                        name="address.state"
                        required
                        value={formData.address.state}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 ${
                          getFieldError('state') ? 'border-red-300' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Selecione o estado</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {getFieldError('state') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('state')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tipo de Usuário */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Tipo de Usuário</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-slate-700 mb-2">
                        Área de Atuação
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="loja">Loja (Marketplace)</option>
                        <option value="agroconecta">AgroConecta (Fretes)</option>
                        <option value="both">Ambas as Áreas</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="userCategory" className="block text-sm font-medium text-slate-700 mb-2">
                        Categoria
                      </label>
                      <select
                        id="userCategory"
                        name="userCategory"
                        value={formData.userCategory}
                        onChange={handleChange}
                        className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="anunciante">Anunciante</option>
                        <option value="comprador">Comprador</option>
                        <option value="freteiro">Freteiro</option>
                        <option value="ambos">Ambos</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Revisão e Confirmação */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Revisão e Confirmação</h3>
                
                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900">Informações Básicas</h4>
                      <p className="text-sm text-slate-600">Nome: {formData.name}</p>
                      <p className="text-sm text-slate-600">Email: {formData.email}</p>
                      <p className="text-sm text-slate-600">Telefone: {formData.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Documentos</h4>
                      <p className="text-sm text-slate-600">{formData.documentType}: {formData.document}</p>
                      {formData.documentType === 'CNPJ' && (
                        <p className="text-sm text-slate-600">IE: {formData.ie}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900">Endereço</h4>
                    <p className="text-sm text-slate-600">
                      {formData.address.street}, {formData.address.number}
                      {formData.address.complement && `, ${formData.address.complement}`}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formData.address.neighborhood}, {formData.address.city} - {formData.address.state}
                    </p>
                    <p className="text-sm text-slate-600">CEP: {formData.cep}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900">Tipo de Usuário</h4>
                    <p className="text-sm text-slate-600">Área: {formData.userType === 'loja' ? 'Loja' : formData.userType === 'agroconecta' ? 'AgroConecta' : 'Ambas'}</p>
                    <p className="text-sm text-slate-600">Categoria: {formData.userCategory}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📧 Verificação de Email</h4>
                  <p className="text-sm text-blue-700">
                    Após o cadastro, você receberá um email de verificação. 
                    Clique no link para ativar sua conta antes de fazer login.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Mensagens de erro/sucesso */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-emerald-700">{success}</span>
              </motion.div>
            )}

            {/* Navegação entre steps */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                  Anterior
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Divisor */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">ou</span>
              </div>
            </div>
          </div>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-800 underline font-medium"
              >
                Faça login aqui
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-slate-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link to="/termos" className="text-slate-600 hover:text-slate-800 underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacidade" className="text-slate-600 hover:text-slate-800 underline">
              Política de Privacidade
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
