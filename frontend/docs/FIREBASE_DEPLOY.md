# 🚀 Firebase Hosting - Deploy Guide

## 📋 Visão Geral

Este documento explica como fazer deploy do projeto AGROTM no Firebase Hosting.

## ⚙️ Configuração

### 1. Arquivos de Configuração

Os seguintes arquivos foram criados:

- ✅ **`firebase.json`** - Configuração principal do Firebase
- ✅ **`.firebaserc`** - Configuração do projeto
- ✅ **`firestore.rules`** - Regras de segurança do Firestore
- ✅ **`storage.rules`** - Regras de segurança do Storage
- ✅ **`firestore.indexes.json`** - Índices do Firestore

### 2. Configuração do Firebase

```json
{
  "hosting": {
    "site": "agrotmsol-95542-cd9d9",
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🚀 Deploy

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login no Firebase

```bash
firebase login
```

### 3. Configurar Projeto

```bash
firebase use agrotmsol-95542
```

### 4. Build e Deploy

#### Deploy Apenas do Hosting
```bash
npm run deploy:firebase
```

#### Deploy Completo (Hosting + Firestore + Storage)
```bash
npm run deploy:firebase:all
```

### 5. Scripts Disponíveis

```bash
# Build estático
npm run build:static

# Deploy apenas do hosting
npm run deploy:firebase

# Deploy completo
npm run deploy:firebase:all

# Login no Firebase
npm run firebase:login

# Logout do Firebase
npm run firebase:logout

# Usar projeto específico
npm run firebase:use

# Iniciar emuladores
npm run firebase:emulators
```

## 🔧 Configuração Detalhada

### Firebase Hosting

- **Site:** `agrotmsol-95542-cd9d9`
- **Public Directory:** `out`
- **Rewrites:** Todas as rotas redirecionam para `index.html` (SPA)

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

## 🛡️ Segurança

### Regras Implementadas

1. **Firestore:**
   - Usuários só podem acessar seus próprios dados
   - Dados públicos podem ser lidos por todos
   - Dados sensíveis requerem autenticação

2. **Storage:**
   - Usuários só podem fazer upload em suas próprias pastas
   - Arquivos públicos podem ser lidos por todos
   - Uploads requerem autenticação

3. **Hosting:**
   - Cache otimizado para arquivos estáticos
   - Headers de segurança configurados
   - Rewrites para SPA

## 🔍 Troubleshooting

### Erro de Build

Se você receber erros de build:

1. Verifique se todas as dependências estão instaladas:
   ```bash
   npm install
   ```

2. Limpe o cache:
   ```bash
   npm run clean
   ```

3. Tente fazer build novamente:
   ```bash
   npm run build:static
   ```

### Erro de Deploy

Se você receber erros de deploy:

1. Verifique se está logado no Firebase:
   ```bash
   firebase login
   ```

2. Verifique se o projeto está configurado:
   ```bash
   firebase use agrotmsol-95542
   ```

3. Verifique as regras do Firestore:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Erro de Permissão

Se você receber erros de permissão:

1. Verifique se tem permissões no projeto Firebase
2. Verifique se as regras estão configuradas corretamente
3. Teste as regras localmente com emuladores

## 🎯 Próximos Passos

1. **Configure as variáveis de ambiente** no Firebase Console
2. **Teste o deploy** em ambiente de desenvolvimento
3. **Configure domínio personalizado** (opcional)
4. **Configure SSL** (automático com Firebase)
5. **Configure CDN** (automático com Firebase)

## 📚 Recursos Adicionais

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase CLI](https://firebase.google.com/docs/cli)

---

**🎉 Firebase Hosting configurado e pronto para deploy!**

Agora você pode fazer deploy do seu projeto AGROTM no Firebase Hosting.
