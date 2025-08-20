# 🚀 Guia de Deploy - AGROISYNC

Este guia explica como fazer o deploy do projeto AGROISYNC para produção usando AWS Amplify.

## 📋 Pré-requisitos

- ✅ Conta AWS ativa
- ✅ Acesso ao AWS Amplify
- ✅ Repositório Git configurado
- ✅ Node.js 18+ instalado
- ✅ MongoDB Atlas configurado
- ✅ Projeto Firebase configurado

## 🔧 Configuração Local

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.production.example .env.production
```

Edite `.env.production` com suas credenciais reais:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/agroisync

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave_api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# JWT Secret (gere uma chave forte)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui
```

### 2. Verificação de Build

Execute o script de deploy para verificar se tudo está funcionando:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🚀 Deploy no AWS Amplify

### 1. Conectar Repositório

1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Clique em "New app" → "Host web app"
3. Conecte seu repositório Git (GitHub, GitLab, etc.)
4. Selecione o branch `main` ou `master`

### 2. Configuração de Build

O arquivo `amplify.yml` já está configurado. Amplify detectará automaticamente:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

### 3. Variáveis de Ambiente

Configure as variáveis de ambiente no Amplify:

1. Vá para "Environment variables"
2. Adicione cada variável do seu `.env.production`
3. **IMPORTANTE**: Não inclua o prefixo `NEXT_PUBLIC_` nas variáveis do servidor

### 4. Deploy Automático

- Amplify fará deploy automático a cada push para o branch principal
- Você pode configurar previews para outros branches
- Monitore os logs de build para identificar problemas

## 🔐 Configuração de Segurança

### 1. Firebase Authentication

1. Configure as regras de segurança no Firebase Console
2. Ative autenticação por email/senha
3. Configure domínios autorizados

### 2. MongoDB Atlas

1. Configure IP whitelist para produção
2. Use usuário com privilégios mínimos necessários
3. Ative auditoria de acesso

### 3. Rate Limiting

Configure rate limiting nas APIs:

```typescript
// Exemplo de implementação
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
}
```

## 📊 Monitoramento

### 1. Logs de Aplicação

- Use CloudWatch para logs do Amplify
- Configure alertas para erros críticos
- Monitore performance das APIs

### 2. Métricas

- Tempo de resposta das APIs
- Taxa de erro
- Uso de recursos
- Usuários ativos

### 3. Alertas

Configure alertas para:
- Builds falhando
- APIs com erro 500
- Tempo de resposta alto
- Uso de memória/CPU alto

## 🚨 Troubleshooting

### Build Falhando

```bash
# Verificar logs localmente
npm run build

# Verificar tipos
npm run type-check

# Verificar dependências
npm audit
```

### APIs Não Respondendo

1. Verificar variáveis de ambiente
2. Verificar conexão com MongoDB
3. Verificar configuração do Firebase
4. Verificar logs do Amplify

### Problemas de Performance

1. Otimizar imagens
2. Implementar cache
3. Usar CDN para assets estáticos
4. Otimizar queries do MongoDB

## 🔄 Atualizações

### 1. Deploy de Atualizações

```bash
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Amplify fará deploy automático
```

### 2. Rollback

1. Vá para "All builds" no Amplify
2. Selecione uma versão anterior
3. Clique em "Promote to main"

### 3. Preview Deployments

Configure previews para branches de feature:

```yaml
# amplify.yml
test:
  phases:
    test:
      commands:
        - npm run test
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

## 📱 Domínio Personalizado

### 1. Configurar DNS

1. Adicione domínio no Amplify
2. Configure registros DNS conforme instruções
3. Aguarde propagação (pode levar até 48h)

### 2. SSL/HTTPS

- Amplify configura SSL automaticamente
- Certificados são renovados automaticamente
- Suporte a múltiplos domínios

## 🎯 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build local funcionando
- [ ] Testes passando
- [ ] Repositório conectado ao Amplify
- [ ] Branch principal configurado
- [ ] Deploy automático ativado
- [ ] Domínio configurado (opcional)
- [ ] Monitoramento configurado
- [ ] Alertas configurados

## 📞 Suporte

- **Documentação AWS Amplify**: https://docs.aws.amazon.com/amplify
- **Firebase Docs**: https://firebase.google.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Issues**: Abra uma issue no repositório

---

## 🎉 Deploy Concluído!

Seu projeto AGROISYNC está agora rodando em produção! 

**URL de produção**: https://seu-app.amplifyapp.com

**Próximos passos**:
1. Teste todas as funcionalidades
2. Configure monitoramento
3. Configure alertas
4. Documente o processo para a equipe

**Boa sorte com o AGROISYNC! 🚀**
