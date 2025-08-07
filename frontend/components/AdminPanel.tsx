'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

interface Document {
  id: string;
  [key: string]: any;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Verificar se o usuário está logado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        loadUsers();
        loadDocuments();
      }
    });

    return () => unsubscribe();
  }, []);

  const getAuthToken = async () => {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/admin/documents?collection=users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setError('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { email: string; password: string; displayName?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar usuário');
      }

      const data = await response.json();
      alert(`Usuário criado com sucesso: ${data.user.email}`);
      loadUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setError('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collection: 'users',
          data: documentData
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar documento');
      }

      const data = await response.json();
      alert(`Documento criado com sucesso: ${data.documentId}`);
      loadDocuments();
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      setError('Erro ao criar documento');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Você precisa estar logado para acessar o painel administrativo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Painel Administrativo - Firebase Admin SDK
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Seção de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerenciar Usuários</h2>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Criar Novo Usuário</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            createUser({
              email: formData.get('email') as string,
              password: formData.get('password') as string,
              displayName: formData.get('displayName') as string
            });
          }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="displayName"
              placeholder="Nome"
              className="p-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Lista de Usuários ({users.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p><strong>UID:</strong> {user.uid}</p>
                  <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                  <p><strong>Nome:</strong> {user.displayName || 'N/A'}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Criado em: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Documentos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerenciar Documentos</h2>
          <button
            onClick={loadDocuments}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Criar Novo Documento</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            createDocument({
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              role: formData.get('role') as string
            });
          }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nome"
              required
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="role"
              placeholder="Função"
              className="p-2 border rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Documento'}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Lista de Documentos ({documents.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p><strong>ID:</strong> {doc.id}</p>
                  <p><strong>Nome:</strong> {doc.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {doc.email || 'N/A'}</p>
                  <p><strong>Função:</strong> {doc.role || 'N/A'}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Criado em: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
