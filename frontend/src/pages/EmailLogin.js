import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { getApiUrl } from '../config/constants';

const EmailLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('agroisyncEmailSession');
      if (raw) {
        navigate('/email/inbox', { replace: true });
      }
    } catch {
      // ignore
    }
  }, [navigate]);

  const handleEmailLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert('Preencha email e senha');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/email/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data?.error || 'Erro ao autenticar');
        return;
      }
      localStorage.setItem('agroisyncEmailSession', JSON.stringify(data.account));
      navigate('/email/inbox', { replace: true });
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      alert('Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Login do Email</h2>
          </div>
          <p className="text-gray-600 mb-6">Acesse sua caixa corporativa @agroisync.com</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="seuemail@agroisync.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Sua senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
