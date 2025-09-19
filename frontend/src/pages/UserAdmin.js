import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminPanel from '../components/AdminPanel';

const UserAdmin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificar autorização (simulação)
    const checkAuthorization = () => {
      // Em produção, isso seria verificado via Cloudflare Access ou JWT
      const secretHeader = new URLSearchParams(window.location.search).get('secret');
      const isDev = process.env.NODE_ENV === 'development';
      
      if (secretHeader === 'agroisync-admin-2024' || isDev) {
        setIsAuthorized(true);
      } else {
        toast.error('Acesso não autorizado');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      }
    };

    checkAuthorization();
  }, []);



  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default UserAdmin;
