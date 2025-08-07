'use client';

import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

interface UserData {
  id?: string;
  name: string;
  email: string;
  createdAt: Date;
}

const FirebaseExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Autenticação
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Salvar dados adicionais no Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        createdAt: new Date()
      });
      
      alert('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro no cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Firestore - CRUD
  const addUser = async () => {
    if (!name || !email) {
      alert('Preencha nome e email!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'users'), {
        name,
        email,
        createdAt: new Date()
      });
      
      alert(`Usuário adicionado com ID: ${docRef.id}`);
      loadUsers();
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      alert('Erro ao adicionar usuário.');
    }
  };

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as UserData);
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const updateUser = async (userId: string, newName: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { name: newName });
      alert('Usuário atualizado com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('Usuário excluído com sucesso!');
        loadUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário.');
      }
    }
  };

  // Storage - Upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `uploads/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      alert(`Arquivo enviado com sucesso! URL: ${downloadURL}`);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro no upload do arquivo.');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Exemplo de Uso do Firebase
      </h1>

      {/* Seção de Autenticação */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Autenticação</h2>
        
        {user ? (
          <div className="space-y-4">
            <p>Logado como: {user.email}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <h3 className="text-lg font-medium">Login</h3>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Cadastro */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <h3 className="text-lg font-medium">Cadastro</h3>
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Seção Firestore */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Firestore - CRUD</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Adicionar Usuário</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Lista de Usuários</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p><strong>Nome:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Criado em:</strong> {user.createdAt?.toDate?.()?.toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newName = prompt('Novo nome:', user.name);
                      if (newName && user.id) {
                        updateUser(user.id, newName);
                      }
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => user.id && deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção Storage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Storage - Upload de Arquivos</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded"
        />
        <p className="text-sm text-gray-600 mt-2">
          Selecione um arquivo para fazer upload para o Firebase Storage
        </p>
      </div>
    </div>
  );
};

export default FirebaseExample;
