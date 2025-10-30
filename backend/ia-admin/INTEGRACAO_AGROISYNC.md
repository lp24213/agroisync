# 🔗 Integração IA com Agroisync Existente

Este documento explica como integrar o backend de IA com o sistema Agroisync existente.

## 📊 Níveis de Acesso por Plano

### 1️⃣ Plano GRATUITO (Público)
- ✅ Visualizar notícias básicas
- ✅ Consultar clima geral
- ✅ Ver cotações públicas
- ❌ Sem acesso a insights avançados
- ❌ Limite de 5 produtos + 5 fretes

**IA deve:**
- Fornecer informações limitadas
- Sugerir upgrade quando atingir limites
- Mostrar benefícios do plano pago

### 2️⃣ Plano PRO (Privado)
- ✅ Todos os recursos do gratuito
- ✅ Insights avançados da IA
- ✅ Análises de mercado
- ✅ Recomendações personalizadas
- ✅ Sem limites de produtos/fretes
- ✅ API access

**IA deve:**
- Fornecer análises completas
- Sugerir otimizações
- Alertas de mercado em tempo real

### 3️⃣ Plano LOJA (E-commerce)
- ✅ Todos os recursos do PRO
- ✅ Dashboard de métricas da loja
- ✅ Sugestões de precificação
- ✅ Análise de concorrência
- ✅ Otimização de estoque

**IA deve:**
- Analisar performance da loja
- Sugerir ajustes de preço
- Identificar produtos em alta

### 4️⃣ Plano ADMIN
- ✅ Acesso total
- ✅ Logs completos
- ✅ Controle manual da IA
- ✅ Configurações avançadas
- ✅ Análises de todos os usuários

**IA deve:**
- Fornecer relatórios executivos
- Alertar sobre problemas críticos
- Sugerir melhorias no sistema

---

## 🔌 Como Integrar com Cloudflare Workers

### Opção 1: Proxy via Cloudflare Worker

Adicione no `backend/src/cloudflare-worker.js`:

```javascript
// Proxy para IA Admin
if (path.startsWith('/api/ia/')) {
  const iaUrl = 'https://seu-servidor-ia.com' + path.replace('/api/ia/', '/api/');
  
  const iaResponse = await fetch(iaUrl, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${env.IA_SECRET_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Forwarded-For': request.headers.get('CF-Connecting-IP')
    },
    body: request.method !== 'GET' ? await request.text() : null
  });
  
  return new Response(await iaResponse.text(), {
    status: iaResponse.status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

### Opção 2: Executar localmente no servidor

```bash
cd backend/ia-admin
chmod +x start.sh
./start.sh
```

### Opção 3: Deploy com Docker

```bash
cd backend/ia-admin
docker-compose up -d
```

---

## 🗄️ Integração com Banco de Dados D1

Para integrar com o D1 existente, adicione em `main.py`:

```python
import httpx

async def get_user_plan(user_id: str) -> str:
    """Consulta plano do usuário no D1"""
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query',
            headers={
                'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={
                'sql': 'SELECT plan FROM users WHERE id = ?',
                'params': [user_id]
            }
        )
        
        data = response.json()
        return data['result'][0]['plan'] if data['success'] else 'gratuito'
```

---

## 🔄 Fluxo de Atualização Automática

```
┌─────────────────┐
│   IA External   │ (OpenAI, Claude, etc)
└────────┬────────┘
         │ API Call with Token
         ▼
┌─────────────────┐
│  FastAPI IA     │ Valida Token + IP
│  (Port 8000)    │ Processa dados
└────────┬────────┘
         │ HTTP Request
         ▼
┌─────────────────┐
│ Cloudflare      │ Atualiza conteúdo
│ Worker + D1     │ Notifica usuários
└─────────────────┘
```

---

## 🧪 Testando a Integração

### 1. Iniciar IA Admin

```bash
cd backend/ia-admin
python main.py
```

### 2. Testar endpoints

```bash
python test_ia.py
```

### 3. Verificar logs

```bash
tail -f ia_actions.log
```

---

## 🔐 Segurança em Produção

### ✅ Checklist de Segurança:

- [ ] Token secreto forte configurado (32+ caracteres)
- [ ] IPs restritos apenas aos servidores necessários
- [ ] HTTPS habilitado
- [ ] Logs sendo monitorados
- [ ] Firewall configurado
- [ ] Rate limiting ativo
- [ ] Backup de logs configurado

### 🛡️ Recomendações:

1. **Nunca** commite o arquivo `.env` no git
2. Use **tokens diferentes** para dev e produção
3. Configure **alertas** para tentativas de acesso não autorizado
4. Faça **rotação de tokens** mensalmente
5. Monitore os **logs** diariamente

---

## 📞 Suporte

Em caso de dúvidas, consulte a documentação ou entre em contato:
- Email: contato@agroisync.com
- Docs: `/docs` (FastAPI Swagger UI)

