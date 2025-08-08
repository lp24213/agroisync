# Configuração de Variáveis de Ambiente no AWS Amplify

Este documento explica como configurar as variáveis de ambiente necessárias para o AGROTM no AWS Amplify.

## 📋 Variáveis de Ambiente Necessárias

### 1. URL da API Backend
- **Nome**: `NEXT_PUBLIC_API_URL`
- **Valor**: `https://sua-api-backend.com` (substitua pela sua URL real)
- **Descrição**: URL base da API backend que será usada pelo frontend

### 2. ID da Metamask
- **Nome**: `NEXT_PUBLIC_METAMASK_ID`
- **Valor**: `0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1`
- **Descrição**: ID da Metamask para autenticação nas requisições da API

## 🚀 Passo a Passo para Configuração

### Passo 1: Acessar o Painel AWS Amplify

1. Faça login no [AWS Console](https://console.aws.amazon.com/)
2. Navegue até o serviço **AWS Amplify**
3. Selecione seu aplicativo AGROTM

### Passo 2: Configurar Variáveis de Ambiente

1. No painel do seu app, clique em **Configurações** (Settings)
2. No menu lateral, clique em **Variáveis de ambiente** (Environment variables)
3. Clique em **Adicionar variável de ambiente** (Add environment variable)

### Passo 3: Adicionar as Variáveis

#### Variável 1: NEXT_PUBLIC_API_URL
```
Nome: NEXT_PUBLIC_API_URL
Valor: https://sua-api-backend.com
Ambiente: All environments (ou selecione os ambientes específicos)
```

#### Variável 2: NEXT_PUBLIC_METAMASK_ID
```
Nome: NEXT_PUBLIC_METAMASK_ID
Valor: 0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1
Ambiente: All environments (ou selecione os ambientes específicos)
```

### Passo 4: Salvar e Fazer Deploy

1. Clique em **Salvar** (Save)
2. O AWS Amplify automaticamente fará um novo deploy com as novas variáveis
3. Aguarde o deploy ser concluído

## 🔍 Verificação da Configuração

### Verificar se as Variáveis Estão Funcionando

1. Acesse sua aplicação após o deploy
2. Abra o console do navegador (F12)
3. Execute o seguinte código para verificar se as variáveis estão carregadas:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Metamask ID:', process.env.NEXT_PUBLIC_METAMASK_ID);
```

### Testar a API

1. Use a função de exemplo para testar a API:

```javascript
import { verificarStatusAPI } from './lib/api-example';

// Testar se a API está funcionando
verificarStatusAPI().then(resultado => {
  if (resultado) {
    console.log('✅ API configurada corretamente');
  } else {
    console.log('❌ Problema na configuração da API');
  }
});
```

## 🔧 Configuração no Backend

### Exemplo de Validação no Backend (Node.js/Express)

```javascript
// middleware/auth.js
const validateMetamaskId = (req, res, next) => {
  const metamaskId = req.headers['x-metamask-id'];
  
  if (!metamaskId) {
    return res.status(401).json({ 
      error: 'Metamask ID não fornecido',
      message: 'Header x-metamask-id é obrigatório'
    });
  }
  
  if (metamaskId !== '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1') {
    return res.status(403).json({ 
      error: 'Metamask ID inválido',
      message: 'ID da Metamask não autorizado'
    });
  }
  
  next();
};

// app.js
app.use('/api', validateMetamaskId);
```

## 🚨 Troubleshooting

### Problema: Variáveis não estão sendo carregadas

**Solução:**
1. Verifique se os nomes das variáveis estão corretos (NEXT_PUBLIC_*)
2. Aguarde alguns minutos após salvar as variáveis
3. Faça um novo deploy manual se necessário

### Problema: API não está respondendo

**Solução:**
1. Verifique se a URL da API está correta
2. Teste a URL diretamente no navegador
3. Verifique se o backend está rodando

### Problema: Erro 403 (Forbidden)

**Solução:**
1. Verifique se o ID da Metamask está correto
2. Confirme se o backend está validando o header `x-metamask-id`
3. Verifique os logs do backend para mais detalhes

## 📞 Suporte

Se você encontrar problemas durante a configuração:

1. Verifique os logs do AWS Amplify
2. Consulte a documentação oficial do AWS Amplify
3. Entre em contato com a equipe de desenvolvimento

## 🔄 Atualização de Variáveis

Para atualizar as variáveis de ambiente:

1. Acesse o painel AWS Amplify
2. Vá para Configurações > Variáveis de ambiente
3. Edite a variável desejada
4. Salve as alterações
5. O deploy automático será iniciado

## 📝 Notas Importantes

- As variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente
- Nunca commite informações sensíveis no código
- Sempre use variáveis de ambiente para configurações
- Mantenha backups das configurações de ambiente
