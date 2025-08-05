# 🔧 Configuração dos GitHub Secrets para Deploy Automático

## 📋 Secrets Necessários

Para conectar o GitHub Actions com a Vercel, você precisa configurar os seguintes secrets:

### 1. VERCEL_TOKEN
- **Como obter:**
  1. Acesse: https://vercel.com/account/tokens
  2. Clique em "Create Token"
  3. Nome: `AGROTM_GITHUB_ACTIONS`
  4. Expiration: `No Expiration`
  5. Scope: `Full Account`
  6. Copie o token gerado

### 2. VERCEL_ORG_ID
- **Como obter:**
  1. Acesse: https://vercel.com/account
  2. Vá em "Settings" → "General"
  3. Copie o "Team ID" (luis-paulos-projects-146dd88b)

## 🔧 Como Configurar no GitHub

1. **Acesse o repositório:** https://github.com/lp24213/agrotm.sol
2. **Vá em Settings** → **Secrets and variables** → **Actions**
3. **Clique em "New repository secret"**
4. **Adicione os secrets:**

```
Name: VERCEL_TOKEN
Value: [cole o token da Vercel]

Name: VERCEL_ORG_ID  
Value: luis-paulos-projects-146dd88b
```

## ✅ Após Configurar

1. Faça um push para triggerar o deploy:
```bash
git add .
git commit -m "🚀 Deploy automático configurado"
git push origin main
```

2. **Acompanhe o deploy:** https://github.com/lp24213/agrotm.sol/actions

## 🎯 Resultado

Após configurar os secrets, cada push na branch `main` vai triggerar automaticamente o deploy na Vercel!

**Projeto:** https://vercel.com/luis-paulos-projects-146dd88b/agrotm.sol
