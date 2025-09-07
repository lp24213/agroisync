import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react';
import validationService from '../services/validationService';

const Register = () => {
  const [formData, setFormData] = useState({
    documentType: 'cpf',
    document: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    userType: 'producer',
    companyName: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    const validation = validationService.validateForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Senhas não coincidem' }));
      return;
    }

    // Validar termos
    if (!formData.acceptTerms) {
      setErrors(prev => ({ ...prev, acceptTerms: 'Você deve aceitar os termos de uso' }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você integraria com a API de cadastro
      console.log('Dados do cadastro:', formData);
      
      // Sucesso
      alert('Cadastro realizado com sucesso!');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors({ submit: 'Erro ao realizar cadastro. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Criar Conta no AgroSync
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Junte-se à maior plataforma de agronegócio do Brasil
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Campos básicos */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Senhas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="mt-1">
                    {Array.isArray(errors.password) ? (
                      errors.password.map((error, index) => (
                        <p key={index} className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      ))
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Digite a senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Termos */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Eu aceito os{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Política de Privacidade
                  </a>{' '}
                  do AgroSync *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Erro de submissão */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Criar Conta</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300">
            Já tem uma conta?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
