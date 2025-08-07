# 🔥 Firebase Admin SDK - Configuração e Uso

## 📋 Visão Geral

Este documento explica como configurar e usar o Firebase Admin SDK no projeto AGROTM para operações administrativas no servidor.

## 🚀 Instalação

O Firebase Admin SDK já foi instalado:

```bash
npm install firebase-admin
```

## ⚙️ Configuração

### 1. Obter Credenciais de Serviço

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Project Settings** (⚙️)
4. Clique na aba **Service accounts**
5. Clique em **Generate new private key**
6. Baixe o arquivo JSON

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Firebase Admin SDK
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=seu_projeto_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=seu_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu_projeto.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=seu_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40seu_projeto.iam.gserviceaccount.com

# Firebase Database URL
FIREBASE_DATABASE_URL=https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app
```

### 3. Estrutura de Arquivos

```
frontend/
├── lib/
│   └── firebase/
│       ├── config.ts      # Firebase Client SDK
│       ├── admin.ts       # Firebase Admin SDK
│       └── auth.ts        # Funções de autenticação
├── app/
│   └── api/
│       └── admin/
│           ├── users/
│           │   └── route.ts    # API para gerenciar usuários
│           └── documents/
│               └── route.ts    # API para gerenciar documentos
└── components/
    └── AdminPanel.tsx     # Componente de exemplo
```

## 🔐 Autenticação com Admin SDK

### Verificar Token ID

```typescript
import adminSDK from '../lib/firebase/admin';

// Verificar token do usuário
const verifyToken = async (idToken: string) => {
  try {
    const decodedToken = await adminSDK.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
};
```

### Criar Token Customizado

```typescript
// Criar token customizado para usuário
const createCustomToken = async (uid: string, additionalClaims?: object) => {
  try {
    const customToken = await adminSDK.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Erro ao criar token:', error);
    throw error;
  }
};
```

## 👥 Gerenciamento de Usuários

### Criar Usuário

```typescript
// Criar novo usuário
const createUser = async (userData: {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
}) => {
  try {
    const userRecord = await adminSDK.createUser(userData);
    return userRecord;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};
```

### Buscar Usuário

```typescript
// Buscar usuário por UID
const getUser = async (uid: string) => {
  try {
    const userRecord = await adminSDK.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};
```

### Atualizar Usuário

```typescript
// Atualizar dados do usuário
const updateUser = async (uid: string, updates: any) => {
  try {
    const userRecord = await adminSDK.updateUser(uid, updates);
    return userRecord;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};
```

### Deletar Usuário

```typescript
// Deletar usuário
const deleteUser = async (uid: string) => {
  try {
    await adminSDK.deleteUser(uid);
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};
```

### Listar Usuários

```typescript
// Listar todos os usuários
const listUsers = async (maxResults?: number) => {
  try {
    const listUsersResult = await adminSDK.listUsers(maxResults);
    return listUsersResult;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
};
```

## 📊 Gerenciamento de Documentos

### Adicionar Documento

```typescript
// Adicionar documento ao Firestore
const addDocument = async (collection: string, data: any) => {
  try {
    const docRef = await adminSDK.addDocument(collection, data);
    return docRef;
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
    throw error;
  }
};
```

### Buscar Documento

```typescript
// Buscar documento por ID
const getDocument = async (collection: string, docId: string) => {
  try {
    const doc = await adminSDK.getDocument(collection, docId);
    return doc;
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    throw error;
  }
};
```

### Atualizar Documento

```typescript
// Atualizar documento
const updateDocument = async (collection: string, docId: string, data: any) => {
  try {
    await adminSDK.updateDocument(collection, docId, data);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    throw error;
  }
};
```

### Deletar Documento

```typescript
// Deletar documento
const deleteDocument = async (collection: string, docId: string) => {
  try {
    await adminSDK.deleteDocument(collection, docId);
    return true;
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    throw error;
  }
};
```

### Consultar Documentos

```typescript
// Consultar documentos com filtros
const queryDocuments = async (collection: string, whereClauses: Array<[string, any, any]>) => {
  try {
    const documents = await adminSDK.queryDocuments(collection, whereClauses);
    return documents;
  } catch (error) {
    console.error('Erro ao consultar documentos:', error);
    throw error;
  }
};

// Exemplo de uso:
const users = await queryDocuments('users', [
  ['role', '==', 'admin'],
  ['active', '==', true]
]);
```

## 🌐 API Routes

### Exemplo de API Route para Usuários

```typescript
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import adminSDK from '../../../../lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autorização
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Token necessário' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminSDK.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Listar usuários
    const listUsersResult = await adminSDK.listUsers(100);
    
    return NextResponse.json({
      success: true,
      users: listUsersResult?.users || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

### Exemplo de API Route para Documentos

```typescript
// app/api/admin/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import adminSDK from '../../../../lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, data } = body;

    // Adicionar documento
    const docRef = await adminSDK.addDocument(collection, data);

    return NextResponse.json({
      success: true,
      documentId: docRef?.id
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

## 🎨 Componente de Exemplo

### AdminPanel Component

```typescript
// components/AdminPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Painel Administrativo</h1>
      <button onClick={loadUsers} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Usuários'}
      </button>
      {/* Lista de usuários */}
    </div>
  );
};
```

## 🔒 Segurança

### Regras de Segurança

1. **Nunca exponha as credenciais do Admin SDK no frontend**
2. **Sempre verifique tokens antes de executar operações administrativas**
3. **Use regras de segurança do Firestore para controlar acesso**
4. **Implemente rate limiting nas API routes**

### Exemplo de Middleware de Autenticação

```typescript
// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import adminSDK from '../lib/firebase/admin';

export async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return { error: 'Token necessário', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decodedToken = await adminSDK.verifyIdToken(token);
    return { user: decodedToken };
  } catch (error) {
    return { error: 'Token inválido', status: 401 };
  }
}
```

## 🚀 Deploy

### Variáveis de Ambiente no Vercel

Configure as seguintes variáveis no dashboard do Vercel:

```env
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=seu_projeto_id
FIREBASE_ADMIN_PRIVATE_KEY_ID=seu_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu_projeto.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=seu_client_id
FIREBASE_DATABASE_URL=https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app
```

## 🔍 Troubleshooting

### Erro de Credenciais

Se você receber erros de credenciais:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se a private key está no formato correto
3. Verifique se o service account tem as permissões necessárias

### Erro de Permissão

Se você receber erros de permissão:

1. Verifique se o service account tem as roles necessárias
2. Confirme se as regras do Firestore permitem as operações
3. Verifique se o projeto está ativo

### Erro de Token

Se você receber erros de token:

1. Verifique se o token está sendo enviado corretamente
2. Confirme se o token não expirou
3. Verifique se o usuário ainda existe

## 📚 Recursos Adicionais

- [Documentação Oficial do Firebase Admin SDK](https://firebase.google.com/docs/admin)
- [Firebase Admin SDK para Node.js](https://firebase.google.com/docs/admin/setup)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli)
