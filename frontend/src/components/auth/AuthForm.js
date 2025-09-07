import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const AuthForm = ({ 
  type = 'login', // 'login', 'register', 'forgot-password'
  module = 'general', // 'crypto', 'agroconecta', 'loja'
  onSubmit,
  onToggleType,
  isLoading = false,
  error = null,
  success = null
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    cpf: '',
    company: '',
    role: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    }
  });

  const [addressSuggestions, setAddressSuggestions] = useState({
    cities: [],
    states: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Campos específicos por módulo
  const getModuleFields = () => {
    switch (module) {
      case 'crypto':
        return ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phone'];
      case 'agroconecta':
        return ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phone', 'cpf', 'company', 'role', 'address'];
      case 'loja':
        return ['email', 'password', 'confirmPassword', 'firstName', 'lastName', 'phone', 'cpf', 'address'];
      default:
        return ['email', 'password', 'confirmPassword', 'firstName', 'lastName'];
    }
  };

  // Buscar sugestões de endereço via API do IBGE
  const fetchAddressSuggestions = async (query, type) => {
    try {
      if (type === 'state') {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const states = await response.json();
        const filtered = states
          .filter(state => state.nome.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);
        setAddressSuggestions(prev => ({ ...prev, states: filtered }));
      } else if (type === 'city' && formData.address.state) {
        const stateCode = formData.address.state;
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`);
        const cities = await response.json();
        const filtered = cities
          .filter(city => city.nome.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);
        setAddressSuggestions(prev => ({ ...prev, cities: filtered }));
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões de endereço:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Buscar sugestões para campos de endereço
    if (field === 'address.state' && value.length > 2) {
      fetchAddressSuggestions(value, 'state');
    } else if (field === 'address.city' && value.length > 2) {
      fetchAddressSuggestions(value, 'city');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      return;
    }
    onSubmit(formData);
  };

  const getModuleTitle = () => {
    const moduleNames = {
      crypto: 'Criptomoedas & DeFi',
      agroconecta: 'AgroConecta',
      loja: 'Loja AgroSync'
    };
    return moduleNames[module] || 'AgroSync';
  };

  const getModuleDescription = () => {
    const descriptions = {
      crypto: 'Acesse o futuro das finanças descentralizadas',
      agroconecta: 'Conecte-se com o mercado agrícola',
      loja: 'Produtos e serviços para o agronegócio'
    };
    return descriptions[module] || 'Plataforma completa para o agronegócio';
  };

  const renderField = (fieldName) => {
    const fieldConfig = {
      email: {
        type: 'email',
        label: 'E-mail',
        placeholder: 'seu@email.com',
        required: true
      },
      password: {
        type: 'password',
        label: 'Senha',
        placeholder: '••••••••',
        required: true,
        showToggle: true
      },
      confirmPassword: {
        type: 'password',
        label: 'Confirmar Senha',
        placeholder: '••••••••',
        required: true,
        showToggle: true
      },
      firstName: {
        type: 'text',
        label: 'Nome',
        placeholder: 'Seu nome',
        required: true
      },
      lastName: {
        type: 'text',
        label: 'Sobrenome',
        placeholder: 'Seu sobrenome',
        required: true
      },
      phone: {
        type: 'tel',
        label: 'Telefone',
        placeholder: '(11) 99999-9999',
        required: true
      },
      cpf: {
        type: 'text',
        label: 'CPF',
        placeholder: '000.000.000-00',
        required: true
      },
      company: {
        type: 'text',
        label: 'Empresa',
        placeholder: 'Nome da empresa',
        required: false
      },
      role: {
        type: 'select',
        label: 'Perfil',
        options: [
          { value: 'driver', label: 'Motorista' },
          { value: 'buyer', label: 'Comprador' },
          { value: 'producer', label: 'Produtor' }
        ],
        required: true
      }
    };

    const config = fieldConfig[fieldName];
    if (!config) return null;

    if (config.type === 'select') {
      return (
        <div key={fieldName} className="space-y-2">
          <label className={`block text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {config.label} {config.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={formData[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            required={config.required}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
            } focus:outline-none focus:ring-2`}
          >
            <option value="">Selecione...</option>
            {config.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={fieldName} className="space-y-2">
        <label className={`block text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {config.label} {config.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={config.showToggle ? (fieldName === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : config.type}
            value={formData[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={config.placeholder}
            required={config.required}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
            } focus:outline-none focus:ring-2`}
          />
          {config.showToggle && (
            <button
              type="button"
              onClick={() => {
                if (fieldName === 'password') {
                  setShowPassword(!showPassword);
                } else {
                  setShowConfirmPassword(!showConfirmPassword);
                }
              }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {fieldName === 'password' ? (showPassword ? '👁️' : '👁️‍🗨️') : (showConfirmPassword ? '👁️' : '👁️‍🗨️')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAddressFields = () => {
    if (module !== 'agroconecta' && module !== 'loja') return null;

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Endereço
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              CEP
            </label>
            <input
              type="text"
              value={formData.address.zipCode || ''}
              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
              placeholder="00000-000"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Estado
            </label>
            <input
              type="text"
              value={formData.address.state || ''}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              placeholder="Digite o estado"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              } focus:outline-none focus:ring-2`}
            />
            {addressSuggestions.states.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {addressSuggestions.states.map(state => (
                  <div
                    key={state.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleInputChange('address.state', state.sigla);
                      setAddressSuggestions(prev => ({ ...prev, states: [] }));
                    }}
                  >
                    {state.nome} ({state.sigla})
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Cidade
            </label>
            <input
              type="text"
              value={formData.address.city || ''}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              placeholder="Digite a cidade"
                          className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
            } focus:outline-none focus:ring-2`}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Bairro
            </label>
            <input
              type="text"
              value={formData.address.neighborhood || ''}
              onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
              placeholder="Nome do bairro"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Rua
            </label>
            <input
              type="text"
              value={formData.address.street || ''}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              placeholder="Nome da rua"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Número
            </label>
            <input
              type="text"
              value={formData.address.number || ''}
              onChange={(e) => handleInputChange('address.number', e.target.value)}
              placeholder="Número"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500/20'
              } focus:outline-none focus:ring-2`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-2xl mx-auto p-8 rounded-2xl ${
        isDark 
          ? 'bg-gray-900/80 backdrop-blur-xl border border-gray-700' 
          : 'bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl'
      }`}
    >
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {type === 'login' ? 'Entrar' : type === 'register' ? 'Cadastrar' : 'Recuperar Senha'}
        </h2>
        <h3 className={`text-xl font-semibold mb-1 ${
          isDark ? 'text-cyan-400' : 'text-green-600'
        }`}>
          {getModuleTitle()}
        </h3>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {getModuleDescription()}
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-center"
        >
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getModuleFields().map(field => renderField(field))}
        </div>

        {renderAddressFields()}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-400/25'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-600/25'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processando...
            </div>
          ) : (
            type === 'login' ? 'Entrar' : type === 'register' ? 'Cadastrar' : 'Enviar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onToggleType}
          className={`text-sm hover:underline transition-colors duration-300 ${
            isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-green-600 hover:text-green-700'
          }`}
        >
          {type === 'login' ? 'Não tem conta? Cadastre-se' : 
           type === 'register' ? 'Já tem conta? Entre aqui' : 
           'Lembrou sua senha? Entre aqui'}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
