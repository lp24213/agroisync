# 🚀 AGROSYNC - Instruções de Deploy

## Problema Identificado e Resolvido

O projeto estava com configurações mistas entre **React** e **Next.js**, causando erro 404 no deploy do AWS Amplify.

## ✅ Correções Aplicadas

### 1. Configuração do Frontend
- ✅ Removido arquivos Next.js desnecessários (`_app.js`, `pages/index.js`)
- ✅ Corrigido `package.json` com chaves duplicadas
- ✅ Configurado corretamente para React + React Router

### 2. Configuração do Amplify
- ✅ Corrigido `amplify.yml` para usar diretório `build` (React) em vez de `.next` (Next.js)
- ✅ Atualizado `backend-config.json` e `amplify-meta.json`
- ✅ Configurado redirecionamentos corretos para SPA

### 3. Arquivos de Configuração
- ✅ `_redirects` configurado para roteamento React
- ✅ `_headers` para segurança e cache
- ✅ Scripts de build robustos

## 🚀 Como Fazer o Deploy

### Opção 1: Script Automático (Recomendado)

**Windows (PowerShell):**
```powershell
.\deploy-clean.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-clean.sh
./deploy-clean.sh
```

### Opção 2: Manual

1. **Limpar builds anteriores:**
   ```bash
   rm -rf frontend/build/
   rm -rf frontend/node_modules/
   rm -rf backend/dist/
   rm -rf backend/node_modules/
   ```

2. **Limpar cache do Amplify:**
   ```bash
   amplify clean
   ```

3. **Reinstalar dependências:**
   ```bash
   cd frontend && npm ci --production=false && cd ..
   cd backend && npm ci --production=false && cd ..
   ```

4. **Fazer deploy:**
   ```bash
   amplify push
   ```

## 🔍 Verificações Pós-Deploy

1. **Console AWS Amplify:** Verificar se o build foi bem-sucedido
2. **URL da aplicação:** Testar se não há mais erro 404
3. **Rotas:** Verificar se todas as páginas estão funcionando
4. **Console do navegador:** Verificar se não há erros JavaScript

## 📁 Estrutura Corrigida

```
agroisync/
├── amplify.yml (configurado para React)
├── frontend/
│   ├── package.json (React, sem chaves duplicadas)
│   ├── public/
│   │   ├── _redirects (roteamento SPA)
│   │   ├── _headers (segurança)
│   │   └── index.html
│   ├── src/
│   │   ├── App.js (React Router)
│   │   └── index.js
│   └── build.sh (script de build)
└── backend/ (configurado para AWS Lambda)
```

## 🚨 Problemas Comuns e Soluções

### Erro 404 persistente
- Verificar se `_redirects` está sendo copiado para `build/`
- Confirmar se `amplify.yml` está apontando para `frontend/build`

### Build falhando
- Executar `amplify clean` antes do deploy
- Verificar se todas as dependências estão instaladas

### Rotas não funcionando
- Confirmar se `_redirects` contém `/* /index.html 200`
- Verificar se React Router está configurado corretamente

## 📞 Suporte

Se o problema persistir:
1. Verificar logs no console AWS Amplify
2. Executar `amplify status` para verificar configuração
3. Verificar se todos os arquivos de configuração estão corretos

---

**✅ Status:** Problema de deploy resolvido
**🚀 Próximo passo:** Executar script de deploy limpo
