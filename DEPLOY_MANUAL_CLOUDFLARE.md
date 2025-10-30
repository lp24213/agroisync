# 🚀 DEPLOY MANUAL CLOUDFLARE PAGES - AGROISYNC

## ⚠️ PROBLEMA ATUAL
Token Cloudflare não está configurado na máquina.
```
Erro: Unable to authenticate request [code: 10001]
```

---

## 📋 PASSO A PASSO PARA DEPLOY MANUAL

### PASSO 1: Obter o Token do Cloudflare
1. Acesse: **https://dash.cloudflare.com**
2. Login com sua conta
3. Vá para **My Profile** (canto superior direito)
4. Clique em **API Tokens**
5. Clique em **Create Token**
6. Escolha template: **Edit Cloudflare Workers**
7. Confirme permissões:
   - ✅ Account Resources: All accounts
   - ✅ Zone Resources: All zones
8. Clique em **Continue to summary**
9. Clique em **Create Token**
10. **COPIE O TOKEN** (aparece uma única vez!)

---

### PASSO 2: Configurar o Token na Máquina

#### OPÇÃO A: Variável de Ambiente Global (Windows)
```powershell
# PowerShell como Administrador
[Environment]::SetEnvironmentVariable("CLOUDFLARE_API_TOKEN","seu_token_aqui","User")
```

**Depois reinicie o terminal PowerShell!**

#### OPÇÃO B: Arquivo .env (Recomendado)
```bash
# Na raiz do projeto (C:\Users\luisp\OneDrive\Área de Trabalho\agroisync)
# Crie um arquivo chamado .env

CLOUDFLARE_API_TOKEN=seu_token_aqui
```

---

### PASSO 3: Configurar o Projeto no Cloudflare

1. Acesse: **https://dash.cloudflare.com/pages**
2. Clique em **Create a project**
3. Escolha **Direct upload**
4. Nome do projeto: **agroisync**
5. Clique em **Create project**

---

### PASSO 4: Fazer o Build do Frontend

```bash
cd frontend
npm run build
```

Isso cria a pasta `frontend/build` com os arquivos compilados.

---

### PASSO 5: Deploy Manual (3 opções)

#### OPÇÃO 1: Drag & Drop (Mais Fácil)
1. Vá para **https://dash.cloudflare.com/pages**
2. Clique no projeto **agroisync**
3. Clique em **Deployments**
4. Arraste a pasta `frontend/build` para a área de upload
5. ✅ Deploy feito!

#### OPÇÃO 2: Command Line (Com Token)
```bash
# Na raiz do projeto
$env:CLOUDFLARE_API_TOKEN="seu_token_aqui"

npx wrangler pages deploy frontend/build --project-name agroisync
```

#### OPÇÃO 3: Via GitHub (CI/CD)
1. Push seu código para GitHub
2. No Cloudflare: **Connect to Git**
3. Escolha seu repositório
4. Configure:
   - Build command: `cd frontend && npm run build`
   - Build output directory: `frontend/build`
5. ✅ Deploy automático a cada push!

---

## 🔥 DEPLOY RÁPIDO AGORA MESMO

Se você já tem o token, execute:

```powershell
# 1. Configurar token na sessão atual
$env:CLOUDFLARE_API_TOKEN="COLE_SEU_TOKEN_AQUI"

# 2. Build do frontend
cd frontend
npm run build
cd ..

# 3. Deploy
npx wrangler pages deploy frontend/build --project-name agroisync
```

---

## ✅ VERIFICAR SE DEU CERTO

Depois do deploy, você verá uma mensagem assim:
```
✨ Deployment created successfully.

Your site is live at: https://seu-dominio.pages.dev
```

Acesse: **https://agroisync.pages.dev**

---

## 🔍 ONDE ENCONTRAR O TOKEN?

### Se você já criou antes:
1. https://dash.cloudflare.com
2. **My Profile** → **API Tokens**
3. Procure por um token com nome relacionado a **Workers** ou **Pages**
4. Clique em **View Token** (não mostra a senha, só regenera)
5. Se não encontrar, crie um novo (veja PASSO 1 acima)

---

## 📊 ESTRUTURA DO PROJETO PARA DEPLOY

```
agroisync/
├── frontend/
│   ├── build/              ← ISSO QUE FAZEMOS DEPLOY
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                ← Deploy separado (Workers)
└── wrangler.toml          ← Config Workers
```

---

## 🚨 ERROS COMUNS E SOLUÇÕES

### Erro: "Unable to authenticate request [code: 10001]"
**Solução:** Token não configurado ou expirado
```bash
# Configurar novamente
$env:CLOUDFLARE_API_TOKEN="novo_token_aqui"
```

### Erro: "Project not found"
**Solução:** Criar o projeto no Cloudflare primeiro (PASSO 3)
1. Vá para https://dash.cloudflare.com/pages
2. Crie um projeto chamado **agroisync**

### Erro: "Build directory not found"
**Solução:** Fazer o build primeiro
```bash
cd frontend
npm run build
```

---

## 🎯 RESUMO RÁPIDO

| Passo | Comando | O que faz |
|-------|---------|-----------|
| 1 | Obter token | https://dash.cloudflare.com/profile/api-tokens |
| 2 | Configurar | `$env:CLOUDFLARE_API_TOKEN="token"` |
| 3 | Build | `cd frontend && npm run build` |
| 4 | Deploy | `npx wrangler pages deploy frontend/build --project-name agroisync` |
| 5 | Verificar | Acesse `https://agroisync.pages.dev` |

---

## 📝 EXEMPLO COMPLETO (Copy & Paste)

```powershell
# 1. Ir para a raiz
cd C:\Users\luisp\OneDrive\Área de Trabalho\agroisync

# 2. Configurar token (SUBSTITUA SEU_TOKEN_AQUI)
$env:CLOUDFLARE_API_TOKEN="SEU_TOKEN_AQUI"

# 3. Build
cd frontend
npm run build
cd ..

# 4. Deploy
npx wrangler pages deploy frontend/build --project-name agroisync

# 5. Abrir no navegador
Start-Process "https://agroisync.pages.dev"
```

---

## 🎊 PRONTO!

Depois que o deploy terminar, seu site estará online em:
**https://agroisync.pages.dev**

---

**Status de Implementação:** ✅ Clima 15 dias MT **PRONTO**  
**Status de Deploy:** 🔴 Aguardando token Cloudflare
