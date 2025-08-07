'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Settings, Shield, Activity, Wallet } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { AuthButton } from '@/components/auth/AuthButton';

export default function DashboardPage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const router = useRouter();

  // Protect this route
  useProtectedRoute('/login');

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useProtectedRoute
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AGROTM
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">
                  {userProfile?.fullName || user.email}
                </p>
                <p className="text-gray-400 text-sm">
                  {user.email}
                </p>
              </div>
              
              <AuthButton
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                icon={<LogOut size={16} />}
              >
                Sair
              </AuthButton>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Bem-vindo ao Dashboard
          </h2>
          <p className="text-gray-400 text-lg">
            Gerencie sua conta e explore as funcionalidades do AGROTM
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {userProfile?.fullName || 'Usuário'}
              </h3>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-medium">
                    {user.emailVerified ? 'Verificado' : 'Não verificado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Activity className="text-blue-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Último login</p>
                  <p className="text-white font-medium">
                    {userProfile?.lastLoginAt 
                      ? new Date(userProfile.lastLoginAt).toLocaleDateString('pt-BR')
                      : 'Agora'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Wallet className="text-purple-400" size={20} />
                <div>
                  <p className="text-gray-400 text-sm">Carteira</p>
                  <p className="text-white font-medium">
                    {userProfile?.walletAddress ? 'Conectada' : 'Não conectada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Link href="/profile">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <User className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Perfil</h3>
                  <p className="text-gray-400 text-sm">Editar informações pessoais</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/settings">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-cyan-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                  <Settings className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Configurações</h3>
                  <p className="text-gray-400 text-sm">Preferências da conta</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/security">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-green-500 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Shield className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Segurança</h3>
                  <p className="text-gray-400 text-sm">Configurações de segurança</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/">
            <AuthButton variant="secondary" size="lg">
              Voltar para o Site
            </AuthButton>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
