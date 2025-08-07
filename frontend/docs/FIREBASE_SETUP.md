# 🔥 Configuração do Firebase - AGROTM

## 📋 Visão Geral

Este documento explica como configurar e usar o Firebase no projeto AGROTM, incluindo autenticação, Firestore e Storage.

## 🚀 Instalação

Os pacotes do Firebase já foram instalados:

```bash
npm install firebase firebase-admin
```

## ⚙️ Configuração

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: `agrotm-solana`)
4. Configure o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Autenticação

1. No Firebase Console, vá para "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite "Email/Password"
5. Clique em "Save"

### 3. Configurar Firestore

1. No Firebase Console, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima
5. Clique em "Done"

### 4. Configurar Storage

1. No Firebase Console, vá para "Storage"
2. Clique em "Get started"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima
5. Clique em "Done"

### 5. Obter Configuração

1. No Firebase Console, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique no ícone da web (</>)
5. Digite um nome para o app (ex: `agrotm-web`)
6. Clique em "Register app"
7. Copie a configuração

### 6. Configurar Variáveis de Ambiente

Crie ou atualize o arquivo `.env.local` na pasta `frontend`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

## 📁 Estrutura de Arquivos

```
frontend/
├── lib/
│   └── firebase/
│       ├── config.ts      # Configuração principal
│       └── auth.ts        # Funções de autenticação
├── components/
│   └── FirebaseExample.tsx # Componente de exemplo
└── docs/
    └── FIREBASE_SETUP.md  # Esta documentação
```

## 🔐 Autenticação

### Login com Email/Senha

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário logado:', userCredential.user);
  } catch (error) {
    console.error('Erro no login:', error);
  }
};
```

### Cadastro de Usuário

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuário criado:', userCredential.user);
  } catch (error) {
    console.error('Erro no cadastro:', error);
  }
};
```

### Logout

```typescript
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase/config';

const logout = async () => {
  try {
    await signOut(auth);
    console.log('Usuário deslogado');
  } catch (error) {
    console.error('Erro no logout:', error);
  }
};
```

### Observar Estado da Autenticação

```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
```

## 📊 Firestore

### Adicionar Documento

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const addUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: new Date()
    });
    console.log('Documento adicionado com ID:', docRef.id);
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
  }
};
```

### Buscar Documentos

```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
  }
};

// Com filtro
const getUsersByEmail = async (email: string) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
  }
};
```

### Atualizar Documento

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const updateUser = async (userId: string, updates: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    console.log('Documento atualizado');
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
  }
};
```

### Excluir Documento

```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const deleteUser = async (userId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('Documento excluído');
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
  }
};
```

## 📁 Storage

### Upload de Arquivo

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase/config';

const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Arquivo enviado:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Erro no upload:', error);
  }
};
```

### Exemplo de Upload

```typescript
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const path = `uploads/${Date.now()}_${file.name}`;
  const downloadURL = await uploadFile(file, path);
  
  if (downloadURL) {
    // Salvar URL no Firestore
    await addDoc(collection(db, 'files'), {
      name: file.name,
      url: downloadURL,
      uploadedAt: new Date()
    });
  }
};
```

## 🔧 Emuladores (Desenvolvimento)

Para desenvolvimento local, você pode usar os emuladores do Firebase:

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login no Firebase

```bash
firebase login
```

### 3. Inicializar Projeto

```bash
firebase init emulators
```

### 4. Iniciar Emuladores

```bash
firebase emulators:start
```

### 5. Configurar para Usar Emuladores

No arquivo `.env.local`:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## 🛡️ Regras de Segurança

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dados públicos podem ser lidos por todos
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Dados de staking
    match /staking/{stakeId} {
      allow read, write: if request.auth != null;
    }
    
    // Dados de NFTs
    match /nfts/{nftId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Usuários podem fazer upload de seus próprios arquivos
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Arquivos públicos podem ser lidos por todos
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Deploy

### 1. Configurar Regras

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 2. Deploy Functions (se necessário)

```bash
firebase deploy --only functions
```

## 📝 Exemplo de Uso Completo

Veja o arquivo `components/FirebaseExample.tsx` para um exemplo completo de como usar todas as funcionalidades do Firebase.

## 🔍 Troubleshooting

### Erro de Configuração

Se você receber erros de configuração:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se o projeto Firebase está ativo
3. Verifique se os serviços (Auth, Firestore, Storage) estão habilitados

### Erro de Permissão

Se você receber erros de permissão:

1. Verifique as regras de segurança do Firestore
2. Confirme se o usuário está autenticado
3. Verifique se as regras do Storage estão configuradas

### Erro de Rede

Se você receber erros de rede:

1. Verifique a conexão com a internet
2. Confirme se o Firebase está acessível
3. Verifique se não há bloqueios de firewall

## 📚 Recursos Adicionais

- [Documentação Oficial do Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Firebase Emulators](https://firebase.google.com/docs/emulator-suite)
