import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Verificar Turnstile primeiro
      const turnstileToken = await window.turnstile?.getResponse();
      
      if (!turnstileToken) {
        toast.error('Por favor, complete a verificação de segurança');
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/auth/forgot-password', {
        email: data.email,
        turnstileToken: turnstileToken
      });

      if (response.data.success) {
        setIsSubmitted(true);
        toast.success('E-mail de redefinição enviado!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao enviar e-mail de redefinição';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-6">
                <EnvelopeIcon className="h-8 w-8 text-green-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                E-mail Enviado!
              </h1>
              
              <p className="text-gray-300 mb-6">
                Se o e-mail estiver cadastrado em nossa plataforma, você receberá instruções de redefinição de senha em alguns minutos.
              </p>
              
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Voltar ao Login
                </Link>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Tentar outro e-mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Esqueci minha senha
            </h1>
            
            <p className="text-gray-300">
              Digite seu e-mail para receber instruções de redefinição
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <input
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                })}
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Cloudflare Turnstile */}
            <div className="flex justify-center">
              <div 
                className="cf-turnstile" 
                data-sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                data-theme="dark"
              ></div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar E-mail de Redefinição'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
