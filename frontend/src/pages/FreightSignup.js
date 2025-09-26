import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Truck, User, Building2, MapPin, FileText, Shield, 
  CheckCircle, AlertCircle, Loader2, ArrowRight, 
  Phone, Mail, CreditCard, Calendar, Clock, Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const FreightSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    email: '',
    phone: '',
    cpf: '',
    
    // Dados da empresa
    companyName: '',
    cnpj: '',
    ie: '', // Inscrição Estadual
    
    // Dados do veículo
    vehicleType: '',
    licensePlate: '',
    vehicleModel: '',
    vehicleYear: '',
    capacity: '',
    
    // Dados do motorista
    driverName: '',
    driverCpf: '',
    driverPhone: '',
    driverLicense: '',
    driverLicenseCategory: '',
    
    // Endereço
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Dados bancários
    bankName: '',
    agency: '',
    account: '',
    accountType: 'corrente',
    
    // Documentos
    hasAntt: false,
    anttNumber: '',
    hasInsurance: false,
    insuranceCompany: '',
    insuranceNumber: '',
    
    // Senha
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [validatedFields, setValidatedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Dados pessoais
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        break;
        
      case 2: // Dados da empresa
        if (!formData.companyName.trim()) newErrors.companyName = 'Nome da empresa é obrigatório';
        if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório';
        if (!formData.ie.trim()) newErrors.ie = 'Inscrição Estadual é obrigatória';
        break;
        
      case 3: // Dados do veículo
        if (!formData.vehicleType.trim()) newErrors.vehicleType = 'Tipo de veículo é obrigatório';
        if (!formData.licensePlate.trim()) newErrors.licensePlate = 'Placa é obrigatória';
        if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Modelo do veículo é obrigatório';
        if (!formData.vehicleYear.trim()) newErrors.vehicleYear = 'Ano do veículo é obrigatório';
        if (!formData.capacity.trim()) newErrors.capacity = 'Capacidade é obrigatória';
        break;
        
      case 4: // Dados do motorista
        if (!formData.driverName.trim()) newErrors.driverName = 'Nome do motorista é obrigatório';
        if (!formData.driverCpf.trim()) newErrors.driverCpf = 'CPF do motorista é obrigatório';
        if (!formData.driverPhone.trim()) newErrors.driverPhone = 'Telefone do motorista é obrigatório';
        if (!formData.driverLicense.trim()) newErrors.driverLicense = 'CNH é obrigatória';
        if (!formData.driverLicenseCategory.trim()) newErrors.driverLicenseCategory = 'Categoria da CNH é obrigatória';
        break;
        
      case 5: // Endereço
        if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
        if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
        if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';
        break;
        
      case 6: // Dados bancários e documentos
        if (!formData.bankName.trim()) newErrors.bankName = 'Nome do banco é obrigatório';
        if (!formData.agency.trim()) newErrors.agency = 'Agência é obrigatória';
        if (!formData.account.trim()) newErrors.account = 'Conta é obrigatória';
        break;
        
      case 7: // Senha
        if (!formData.password.trim()) newErrors.password = 'Senha é obrigatória';
        if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Senhas não coincidem';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setValidatedFields(prev => ({ ...prev, [currentStep]: true }));
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(7)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await authService.register({
        ...formData,
        userType: 'freight',
        businessType: 'transport'
      });

      if (result.success) {
        toast.success('Cadastro de transportador realizado com sucesso!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      toast.error('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: User },
    { number: 2, title: 'Empresa', icon: Building2 },
    { number: 3, title: 'Veículo', icon: Truck },
    { number: 4, title: 'Motorista', icon: User },
    { number: 5, title: 'Endereço', icon: MapPin },
    { number: 6, title: 'Bancário', icon: CreditCard },
    { number: 7, title: 'Senha', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cadastro de Transportador
            </h1>
            <p className="text-gray-600">
              Preencha todos os dados para se cadastrar como transportador
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = validatedFields[step.number];
                
                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-full h-1 mt-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit}>
              {/* Step 1: Dados Pessoais */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Seu nome completo"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="seu@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(11) 99999-9999"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.cpf ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="000.000.000-00"
                      />
                      {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Dados da Empresa */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados da Empresa</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da sua empresa"
                      />
                      {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.cnpj ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00.000.000/0000-00"
                      />
                      {errors.cnpj && <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inscrição Estadual *
                      </label>
                      <input
                        type="text"
                        name="ie"
                        value={formData.ie}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.ie ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="000000000"
                      />
                      {errors.ie && <p className="text-red-500 text-sm mt-1">{errors.ie}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dados do Veículo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados do Veículo</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Veículo *
                      </label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="caminhao">Caminhão</option>
                        <option value="carreta">Carreta</option>
                        <option value="bitrem">Bitrem</option>
                        <option value="rodotrem">Rodotrem</option>
                        <option value="toco">Toco</option>
                        <option value="truck">Truck</option>
                      </select>
                      {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placa *
                      </label>
                      <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.licensePlate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="ABC-1234"
                      />
                      {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Volvo FH 540"
                      />
                      {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano *
                      </label>
                      <input
                        type="number"
                        name="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.vehicleYear ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="2020"
                        min="1990"
                        max="2024"
                      />
                      {errors.vehicleYear && <p className="text-red-500 text-sm mt-1">{errors.vehicleYear}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacidade (kg) *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.capacity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="25000"
                      />
                      {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Dados do Motorista */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados do Motorista</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Motorista *
                      </label>
                      <input
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome completo do motorista"
                      />
                      {errors.driverName && <p className="text-red-500 text-sm mt-1">{errors.driverName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF do Motorista *
                      </label>
                      <input
                        type="text"
                        name="driverCpf"
                        value={formData.driverCpf}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverCpf ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="000.000.000-00"
                      />
                      {errors.driverCpf && <p className="text-red-500 text-sm mt-1">{errors.driverCpf}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone do Motorista *
                      </label>
                      <input
                        type="tel"
                        name="driverPhone"
                        value={formData.driverPhone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(11) 99999-9999"
                      />
                      {errors.driverPhone && <p className="text-red-500 text-sm mt-1">{errors.driverPhone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNH *
                      </label>
                      <input
                        type="text"
                        name="driverLicense"
                        value={formData.driverLicense}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverLicense ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000000000"
                      />
                      {errors.driverLicense && <p className="text-red-500 text-sm mt-1">{errors.driverLicense}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria da CNH *
                      </label>
                      <select
                        name="driverLicenseCategory"
                        value={formData.driverLicenseCategory}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.driverLicenseCategory ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione a categoria</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                      {errors.driverLicenseCategory && <p className="text-red-500 text-sm mt-1">{errors.driverLicenseCategory}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Endereço */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Endereço</h2>
                  
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.cep ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000-000"
                      />
                      {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da rua"
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Apto, sala, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome do bairro"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da cidade"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione o estado</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="GO">Goiás</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PR">Paraná</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="SC">Santa Catarina</option>
                      </select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Dados Bancários e Documentos */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Bancários e Documentos</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Banco *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.bankName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Banco do Brasil"
                      />
                      {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agência *
                      </label>
                      <input
                        type="text"
                        name="agency"
                        value={formData.agency}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.agency ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0000"
                      />
                      {errors.agency && <p className="text-red-500 text-sm mt-1">{errors.agency}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Conta *
                      </label>
                      <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.account ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000-0"
                      />
                      {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Conta
                      </label>
                      <select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="corrente">Conta Corrente</option>
                        <option value="poupanca">Conta Poupança</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          name="hasAntt"
                          checked={formData.hasAntt}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Possui registro ANTT
                        </label>
                      </div>
                    </div>

                    {formData.hasAntt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número ANTT
                        </label>
                        <input
                          type="text"
                          name="anttNumber"
                          value={formData.anttNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Número do registro ANTT"
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          name="hasInsurance"
                          checked={formData.hasInsurance}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Possui seguro
                        </label>
                      </div>
                    </div>

                    {formData.hasInsurance && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Seguradora
                          </label>
                          <input
                            type="text"
                            name="insuranceCompany"
                            value={formData.insuranceCompany}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nome da seguradora"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número da Apólice
                          </label>
                          <input
                            type="text"
                            name="insuranceNumber"
                            value={formData.insuranceNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Número da apólice"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Senha */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Senha</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Senha *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Digite a senha novamente"
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Voltar
                </button>

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Finalizar Cadastro
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login aqui
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FreightSignup;
