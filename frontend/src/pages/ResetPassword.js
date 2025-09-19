import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const token = searchParams.get('token');
  const userId = searchParams.get('id');
  const password = watch('password');

  useEffect(() => {
    if (!token || !userId) {
      toast.error('Link de redefinição inválido');
      navigate('/forgot-password');
    }
  }, [token, userId, navigate]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        userId,
        password: data.password
      });

      if (response.data.success) {
        toast.success('Senha redefinida com sucesso!');
        navigate('/login', { 
          state: { message: 'Senha redefinida com sucesso. Faça login com sua nova senha.' }
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao redefinir senha';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !userId) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Link Inválido</h1>
          <p className="text-gray-300 mb-6">O link de redefinição de senha é inválido ou expirou.</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Solicitar Novo Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Redefinir Senha
            </h1>
            
            <p className="text-gray-300">
              Digite sua nova senha para redefinir o acesso à sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => value === password || 'As senhas não coincidem'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Redefinindo...
                </div>
              ) : (
                'Redefinir Senha'
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

export default ResetPassword;
