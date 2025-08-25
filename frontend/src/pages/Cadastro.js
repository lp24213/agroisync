import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Building, Phone, Mail, Package, Truck, 
  FileText, Upload, CheckCircle, AlertCircle
} from 'lucide-react';

const Cadastro = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { signUp, loading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    modules: {
      store: false,
      freight: false
    },
    // Dados específicos para Loja
    products: [{
      name: '',
      specs: '',
      price: '',
      images: []
    }],
    // Dados específicos para AgroConecta
    freightData: {
      routeFrom: '',
      routeTo: '',
      estimatedDays: '',
      freightPrice: '',
      weightKg: '',
      nfNumber: '',
      notes: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleModuleChange = (module) => {
    setFormData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: !prev.modules[module]
      }
    }));
  };

  const handleProductChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        specs: '',
        price: '',
        images: []
      }]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleFreightDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      freightData: {
        ...prev.freightData,
        [field]: value
      }
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    // Validar senha
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter maiúsculas, minúsculas e números';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.modules.store && !formData.modules.freight) {
      newErrors.modules = 'Selecione pelo menos um módulo';
    }

    // Validar produtos se Loja selecionado
    if (formData.modules.store) {
      formData.products.forEach((product, index) => {
        if (!product.name.trim()) {
          newErrors[`product${index}Name`] = 'Nome do produto é obrigatório';
        }
        if (!product.specs.trim()) {
          newErrors[`product${index}Specs`] = 'Especificações são obrigatórias';
        }
        if (!product.price.trim()) {
          newErrors[`product${index}Price`] = 'Preço é obrigatório';
        }
      });
    }

    // Validar dados de frete se AgroConecta selecionado
    if (formData.modules.freight) {
      const { freightData } = formData;
      if (!freightData.routeFrom.trim()) {
        newErrors.routeFrom = 'Rota de origem é obrigatória';
      }
      if (!freightData.routeTo.trim()) {
        newErrors.routeTo = 'Rota de destino é obrigatória';
      }
      if (!freightData.estimatedDays.trim()) {
        newErrors.estimatedDays = 'Dias estimados são obrigatórios';
      }
      if (!freightData.freightPrice.trim()) {
        newErrors.freightPrice = 'Preço do frete é obrigatório';
      }
      if (!freightData.weightKg.trim()) {
        newErrors.weightKg = 'Peso é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      // Cadastrar usuário no Cognito
      const result = await signUp(formData.email, formData.password, formData.name);
      
      if (result.success) {
        // Salvar dados adicionais no localStorage para uso posterior
        localStorage.setItem('cadastroData', JSON.stringify({
          company: formData.company,
          phone: formData.phone,
          modules: formData.modules,
          products: formData.products,
          freightData: formData.freightData
        }));

        // Redirecionar para Planos
        window.location.href = '/planos';
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao realizar cadastro. Tente novamente.' });
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-2">
          <User className="inline w-4 h-4 mr-2" />
          Nome Completo *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="Digite seu nome completo"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Building className="inline w-4 h-4 mr-2" />
          Nome da Empresa *
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.company ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="Digite o nome da sua empresa"
        />
        {errors.company && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.company}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Phone className="inline w-4 h-4 mr-2" />
          Telefone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="(00) 00000-0000"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          E-mail *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Senha *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12`}
            placeholder="Mínimo 8 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Confirmar Senha *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12`}
            placeholder="Confirme sua senha"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold mb-4">Selecione os Módulos</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.modules.store}
              onChange={() => handleModuleChange('store')}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-500" />
              <span>Loja - Marketplace de Produtos</span>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.modules.freight}
              onChange={() => handleModuleChange('freight')}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-green-500" />
              <span>AgroConecta - Gestão de Fretes</span>
            </div>
          </label>
        </div>
        {errors.modules && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.modules}
          </p>
        )}
      </div>

      {/* Módulo Loja */}
      {formData.modules.store && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3 flex items-center">
            <Package className="w-4 h-4 mr-2 text-blue-500" />
            Produtos para Loja
          </h4>
          {formData.products.map((product, index) => (
            <div key={index} className="mb-4 p-3 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Produto {index + 1}</span>
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      errors[`product${index}Name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do produto"
                  />
                  {errors[`product${index}Name`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`product${index}Name`]}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    value={product.specs}
                    onChange={(e) => handleProductChange(index, 'specs', e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      errors[`product${index}Specs`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Especificações"
                  />
                  {errors[`product${index}Specs`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`product${index}Specs`]}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    className={`w-full px-3 py-2 rounded border ${
                      errors[`product${index}Price`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Preço (R$)"
                  />
                  {errors[`product${index}Price`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`product${index}Price`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addProduct}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Adicionar Produto
          </button>
        </div>
      )}

      {/* Módulo AgroConecta */}
      {formData.modules.freight && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3 flex items-center">
            <Truck className="w-4 h-4 mr-2 text-green-500" />
            Dados de Frete (AgroConecta)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rota de Origem *</label>
              <input
                type="text"
                value={formData.freightData.routeFrom}
                onChange={(e) => handleFreightDataChange('routeFrom', e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  errors.routeFrom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cidade/Estado de origem"
              />
              {errors.routeFrom && (
                <p className="text-red-500 text-xs mt-1">{errors.routeFrom}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rota de Destino *</label>
              <input
                type="text"
                value={formData.freightData.routeTo}
                onChange={(e) => handleFreightDataChange('routeTo', e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  errors.routeTo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cidade/Estado de destino"
              />
              {errors.routeTo && (
                <p className="text-red-500 text-xs mt-1">{errors.routeTo}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dias Estimados *</label>
              <input
                type="number"
                value={formData.freightData.estimatedDays}
                onChange={(e) => handleFreightDataChange('estimatedDays', e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  errors.estimatedDays ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Número de dias"
              />
              {errors.estimatedDays && (
                <p className="text-red-500 text-xs mt-1">{errors.estimatedDays}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Preço do Frete *</label>
              <input
                type="text"
                value={formData.freightData.freightPrice}
                onChange={(e) => handleFreightDataChange('freightPrice', e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  errors.freightPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="R$ 0,00"
              />
              {errors.freightPrice && (
                <p className="text-red-500 text-xs mt-1">{errors.freightPrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg) *</label>
              <input
                type="number"
                value={formData.freightData.weightKg}
                onChange={(e) => handleFreightDataChange('weightKg', e.target.value)}
                className={`w-full px-3 py-2 rounded border ${
                  errors.weightKg ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.weightKg && (
                <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Número da NF</label>
              <input
                type="text"
                value={formData.freightData.nfNumber}
                onChange={(e) => handleFreightDataChange('nfNumber', e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300"
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Observações</label>
            <textarea
              value={formData.freightData.notes}
              onChange={(e) => handleFreightDataChange('notes', e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300"
              rows="3"
              placeholder="Informações adicionais sobre o frete..."
            />
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={`min-h-screen py-20 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cadastro AgroTM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Crie sua conta e comece a usar a plataforma completa do agronegócio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Passo {step} de 2</span>
              <span className="text-sm text-gray-500">
                {step === 1 ? 'Informações Pessoais' : 'Módulos e Dados'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          {step === 1 ? renderStep1() : renderStep2()}

          {/* Error de submissão */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {errors.submit}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
              >
                Voltar
              </button>
            )}
            
            <button
              onClick={nextStep}
              disabled={loading}
              className={`ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : step === 2 ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finalizar Cadastro
                </>
              ) : (
                <>
                  Próximo
                  <FileText className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cadastro;
