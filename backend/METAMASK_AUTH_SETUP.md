# Configuração de Autenticação Metamask no Backend

Este documento explica como configurar a autenticação via ID da Metamask no backend do AGROTM.

## 📋 Configuração Necessária

### 1. Variável de Ambiente

Adicione a seguinte variável de ambiente no seu backend:

```bash
# ID da Metamask autorizada para acessar a API
METAMASK_ID=0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1
```

## 🔧 Implementação

### Middleware de Validação

O middleware `validateMetamaskId` foi implementado em `src/middleware/metamaskAuth.js` e:

1. **Verifica a presença do header**: `x-metamask-id`
2. **Valida a ID**: Compara com a ID autorizada
3. **Registra tentativas**: Log de todas as tentativas de acesso
4. **Adiciona informações ao request**: `req.metamaskId` e `req.isAuthenticated`

### Aplicação nas Rotas

O middleware foi aplicado nas seguintes rotas:

```javascript
// Rotas que requerem autenticação Metamask
app.use('/api/users', logMetamaskAccess, validateMetamaskId, authMiddleware, userRoutes);
app.use('/api/staking', logMetamaskAccess, validateMetamaskId, authMiddleware, stakingRoutes);
app.use('/api/nfts', logMetamaskAccess, validateMetamaskId, authMiddleware, nftRoutes);
app.use('/api/analytics', logMetamaskAccess, validateMetamaskId, authMiddleware, analyticsRoutes);
app.use('/api/upload', logMetamaskAccess, validateMetamaskId, authMiddleware, uploadRoutes);
app.use('/api/marketplace', logMetamaskAccess, validateMetamaskId, marketplaceRoutes);
app.use('/api/dashboard', logMetamaskAccess, validateMetamaskId, authMiddleware, dashboardRoutes);

// Rotas que apenas registram acesso (sem validação obrigatória)
app.use('/api/auth', logMetamaskAccess, authRoutes);
app.use('/api/contact', logMetamaskAccess, contactRoutes);
```

## 🚀 Como Funciona

### 1. Requisição do Frontend

O frontend envia requisições com o header `x-metamask-id`:

```javascript
// Exemplo de requisição
fetch('/api/users/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'x-metamask-id': '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1'
  }
});
```

### 2. Validação no Backend

O middleware valida a requisição:

```javascript
// Middleware de validação
const validateMetamaskId = (req, res, next) => {
  const metamaskId = req.headers['x-metamask-id'];
  const authorizedMetamaskId = process.env.METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';
  
  if (!metamaskId) {
    return res.status(401).json({
      success: false,
      error: 'Metamask ID não fornecido',
      message: 'Header x-metamask-id é obrigatório para autenticação'
    });
  }
  
  if (metamaskId !== authorizedMetamaskId) {
    return res.status(403).json({
      success: false,
      error: 'Metamask ID inválido',
      message: 'ID da Metamask não autorizado para acessar este recurso'
    });
  }
  
  req.metamaskId = metamaskId;
  req.isAuthenticated = true;
  next();
};
```

### 3. Resposta

Se a validação for bem-sucedida, a requisição continua normalmente. Caso contrário, retorna erro 401 ou 403.

## 📊 Logs e Monitoramento

### Logs de Acesso

Todos os acessos são registrados com:

- **Metamask ID**: ID da Metamask usada
- **IP**: Endereço IP do cliente
- **User-Agent**: Navegador/dispositivo
- **Timestamp**: Data e hora da requisição
- **URL**: Endpoint acessado

### Exemplo de Log

```
INFO: Tentativa de acesso - Metamask ID: 0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1 - IP: 192.168.1.100 - User-Agent: Mozilla/5.0... - Timestamp: 2024-01-15T10:30:00.000Z
INFO: Requisição autenticada com Metamask ID: 0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1 - GET /api/users/profile
```

## 🔒 Segurança

### Medidas Implementadas

1. **Validação obrigatória**: Todas as rotas protegidas requerem a ID da Metamask
2. **Logs de auditoria**: Todas as tentativas de acesso são registradas
3. **Rate limiting**: Limitação de requisições por IP
4. **CORS**: Configuração restritiva de origens permitidas
5. **Headers de segurança**: Helmet.js para headers de segurança

### Recomendações

1. **Use HTTPS**: Sempre use HTTPS em produção
2. **Monitore logs**: Acompanhe os logs de acesso regularmente
3. **Atualize a ID**: Mude a ID da Metamask periodicamente
4. **Backup**: Mantenha backup das configurações de ambiente

## 🚨 Troubleshooting

### Problema: Erro 401 (Unauthorized)

**Causa**: Header `x-metamask-id` não fornecido

**Solução**:
1. Verifique se o frontend está enviando o header
2. Confirme se a variável de ambiente está configurada
3. Verifique os logs do backend

### Problema: Erro 403 (Forbidden)

**Causa**: ID da Metamask inválida

**Solução**:
1. Verifique se a ID está correta no frontend
2. Confirme se a variável `METAMASK_ID` está configurada corretamente
3. Verifique os logs para ver qual ID foi enviada

### Problema: Logs não aparecem

**Solução**:
1. Verifique se o logger está configurado corretamente
2. Confirme se o nível de log está adequado
3. Verifique se o middleware está sendo aplicado

## 📝 Exemplos de Uso

### Exemplo 1: Rota Protegida

```javascript
// Rota que requer autenticação Metamask
app.get('/api/users/profile', validateMetamaskId, (req, res) => {
  // req.metamaskId contém a ID da Metamask
  // req.isAuthenticated é true
  
  res.json({
    success: true,
    data: {
      metamaskId: req.metamaskId,
      profile: userProfile
    }
  });
});
```

### Exemplo 2: Rota Opcional

```javascript
// Rota que aceita autenticação opcional
app.get('/api/public/data', optionalMetamaskAuth, (req, res) => {
  if (req.isAuthenticated) {
    // Usuário autenticado
    res.json({ data: privateData, authenticated: true });
  } else {
    // Usuário não autenticado
    res.json({ data: publicData, authenticated: false });
  }
});
```

## 🔄 Atualização da ID

Para atualizar a ID da Metamask:

1. **Backend**: Atualize a variável de ambiente `METAMASK_ID`
2. **Frontend**: Atualize a variável `NEXT_PUBLIC_METAMASK_ID`
3. **Deploy**: Faça deploy das alterações
4. **Teste**: Verifique se as requisições estão funcionando

## 📞 Suporte

Se você encontrar problemas:

1. Verifique os logs do backend
2. Confirme as configurações de ambiente
3. Teste as requisições manualmente
4. Entre em contato com a equipe de desenvolvimento
