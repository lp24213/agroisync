import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminPanel from '../components/AdminPanel';

const UserAdmin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('agro_token');
        if (!token) {
          toast.error('Sessão inválida. Faça login novamente.');
          window.location.href = '/admin';
          return;
        }

        const resp = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resp?.data?.success) {
          setIsAuthorized(true);
          return;
        }

        throw new Error('Unauthorized');
      } catch (err) {
        toast.error('Acesso não autorizado');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1500);
      }
    };

    verifyAdmin();
  }, []);

  if (!isAuthorized) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Lock className='mx-auto mb-4 h-16 w-16 text-red-500' />
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>Acesso Negado</h1>
          <p className='text-gray-600'>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default UserAdmin;
