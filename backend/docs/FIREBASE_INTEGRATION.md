# 🔥 Firebase Integration - Backend

## 📋 Visão Geral

Este documento explica como o Firebase foi integrado no backend do AGROTM para fornecer serviços de autenticação, banco de dados e storage.

## 🏗️ Arquitetura

```
Frontend (Vercel) → Backend (Railway) → Firebase (Google)
     ↓                    ↓                    ↓
  Next.js App        Express API         Firestore/Storage
```

## ⚙️ Configuração

### 1. Dependências Instaladas

```json
{
  "dependencies": {
    "firebase-admin": "^13.4.0"
  }
}
```

### 2. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Firebase Admin SDK Configuration
FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=agrotmsol-95542
FIREBASE_ADMIN_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@agrotmsol-95542.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your_client_id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40agrotmsol-95542.iam.gserviceaccount.com

# Firebase Database URL (Realtime Database)
FIREBASE_DATABASE_URL=https://agrotmsol-95542-default-rtdb.asia-southeast1.firebasedatabase.app

# Firebase Storage Bucket
FIREBASE_STORAGE_BUCKET=agrotmsol-95542.firebasestorage.app
```

## 🔧 Implementação

### 1. Configuração do Firebase

**Arquivo:** `src/config/firebase.ts`

```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin SDK Configuration
export const firebaseAdmin = {
  // Authentication
  auth: adminAuth,
  
  // Firestore
  db: adminDb,
  
  // Storage
  storage: adminStorage,
  
  // User management functions
  async createUser(userData) { /* ... */ },
  async getUser(uid) { /* ... */ },
  async updateUser(uid, updates) { /* ... */ },
  async deleteUser(uid) { /* ... */ },
  async listUsers(maxResults) { /* ... */ },
  
  // Firestore functions
  async addDocument(collection, data) { /* ... */ },
  async getDocument(collection, docId) { /* ... */ },
  async updateDocument(collection, docId, data) { /* ... */ },
  async deleteDocument(collection, docId) { /* ... */ },
  async queryDocuments(collection, whereClauses) { /* ... */ }
};
```

### 2. Rotas do Firebase

**Arquivo:** `src/routes/firebase.ts`

```typescript
import express from 'express';
import { firebaseAdmin } from '../config/firebase';

const router = express.Router();

// User management routes
router.get('/users', verifyFirebaseToken, async (req, res) => {
  // List users
});

router.post('/users', verifyFirebaseToken, async (req, res) => {
  // Create user
});

router.get('/users/:uid', verifyFirebaseToken, async (req, res) => {
  // Get user
});

router.put('/users/:uid', verifyFirebaseToken, async (req, res) => {
  // Update user
});

router.delete('/users/:uid', verifyFirebaseToken, async (req, res) => {
  // Delete user
});

// Firestore routes
router.post('/documents/:collection', verifyFirebaseToken, async (req, res) => {
  // Add document
});

router.get('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  // Get document
});

router.put('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  // Update document
});

router.delete('/documents/:collection/:docId', verifyFirebaseToken, async (req, res) => {
  // Delete document
});

router.get('/documents/:collection', verifyFirebaseToken, async (req, res) => {
  // Query documents
});

// Custom token generation
router.post('/tokens/custom', verifyFirebaseToken, async (req, res) => {
  // Create custom token
});

// Health check
router.get('/health', async (req, res) => {
  // Firebase health check
});
```

## 🚀 Endpoints Disponíveis

### Base URL: `/api/firebase`

#### User Management
- `GET /api/firebase/users` - Listar usuários
- `POST /api/firebase/users` - Criar usuário
- `GET /api/firebase/users/:uid` - Obter usuário
- `PUT /api/firebase/users/:uid` - Atualizar usuário
- `DELETE /api/firebase/users/:uid` - Deletar usuário

#### Firestore
- `POST /api/firebase/documents/:collection` - Adicionar documento
- `GET /api/firebase/documents/:collection/:docId` - Obter documento
- `PUT /api/firebase/documents/:collection/:docId` - Atualizar documento
- `DELETE /api/firebase/documents/:collection/:docId` - Deletar documento
- `GET /api/firebase/documents/:collection` - Consultar documentos

#### Authentication
- `POST /api/firebase/tokens/custom` - Gerar token customizado
- `GET /api/firebase/health` - Health check

## 🔐 Autenticação

### Token Verification

Todas as rotas do Firebase requerem autenticação via token Bearer:

```bash
Authorization: Bearer <firebase_id_token>
```

### Exemplo de Uso

```bash
# Listar usuários
curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/api/firebase/users

# Criar usuário
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123"}' \
     http://localhost:3001/api/firebase/users

# Adicionar documento
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com"}' \
     http://localhost:3001/api/firebase/documents/users
```

## 🛡️ Segurança

### Implementado

1. **Token Verification**: Todas as rotas verificam tokens Firebase
2. **Error Handling**: Tratamento robusto de erros
3. **Input Validation**: Validação de entrada
4. **Rate Limiting**: Limitação de taxa (configurada no servidor)

### Boas Práticas

1. **Nunca exponha credenciais** no frontend
2. **Sempre verifique tokens** antes de operações
3. **Use HTTPS** em produção
4. **Implemente rate limiting** adequado
5. **Monitore logs** regularmente

## 🔍 Troubleshooting

### Erro de Inicialização

Se o Firebase não inicializar:

1. Verifique as variáveis de ambiente
2. Confirme se as credenciais estão corretas
3. Verifique se o projeto Firebase existe

### Erro de Token

Se houver erro de token:

1. Verifique se o token é válido
2. Confirme se o token não expirou
3. Verifique se o usuário existe no Firebase

### Erro de Conexão

Se houver erro de conexão:

1. Verifique a conectividade com a internet
2. Confirme se o projeto Firebase está ativo
3. Verifique as regras de segurança do Firestore

## 📚 Recursos Adicionais

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

**🎉 Firebase integrado com sucesso no backend!**

O Firebase agora está totalmente integrado no backend do AGROTM, fornecendo serviços de autenticação, banco de dados e storage de forma segura e eficiente.
