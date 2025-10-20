# 🎯 FLUXO COMPLETO - AGROISYNC

## ✅ IMPLEMENTAÇÃO FINAL

---

## 📝 1. CADASTRO (`/register`)

### Como funciona:
1. **Usuário preenche formulário:**
   - Nome completo
   - Email
   - Empresa
   - Telefone
   - Senha

2. **Clica em "Criar Conta"**
   - API: `POST /api/auth/register`
   - Cria usuário com `business_type = 'all'`
   - Retorna token JWT

3. **Tela muda para seleção de tipo:**
   - ✅ Ícone de sucesso
   - "Conta criada com sucesso!"
   - "Agora escolha o tipo do seu perfil:"

4. **3 opções aparecem:**
   - 🛒 **Comprador** - Comprar produtos agrícolas
   - 🚛 **Freteiro** - Oferecer serviços de transporte  
   - 📦 **Anunciante** - Vender produtos agrícolas

5. **Ao clicar em um tipo:**
   - API: `PUT /api/user/profile` com `{business_type: 'tipo'}`
   - Backend atualiza:
     - `business_type`
     - `limit_products`
     - `limit_freights`
   - Redirecionamento: `/plans?type={tipo}`

---

## 💎 2. PLANOS (`/plans?type={tipo}`)

### Planos por Tipo:

#### 🛒 **COMPRADOR:**
```javascript
{
  "Gratuito": {
    price: 0,
    limits: { produtos: 9999, fretes: 0 },
    features: ["Compras ilimitadas", "Chat", "Histórico"]
  },
  "Premium": {
    price: 29.90,
    limits: { produtos: 9999, fretes: 0 },
    features: ["Descontos 15%", "Frete grátis", "Cashback 2%"]
  }
}
```

#### 🚛 **FRETEIRO:**
```javascript
{
  "Básico": {
    price: 49.90,
    limits: { fretes: 10, produtos: 0 }
  },
  "Profissional": {
    price: 99.90,
    limits: { fretes: 50, produtos: 0 }
  },
  "Enterprise": {
    price: 299.90,
    limits: { fretes: 9999, produtos: 0 }
  }
}
```

#### 📦 **ANUNCIANTE:**
```javascript
{
  "Starter": {
    price: 39.90,
    limits: { produtos: 5, fretes: 0 }
  },
  "Crescimento": {
    price: 89.90,
    limits: { produtos: 25, fretes: 0 }
  },
  "Professional": {
    price: 179.90,
    limits: { produtos: 100, fretes: 0 }
  },
  "Enterprise": {
    price: 499.90,
    limits: { produtos: 9999, fretes: 0 }
  }
}
```

### Seletor de Tipo:
- UI com 3 tabs: Comprador | Freteiro | Anunciante
- Planos filtrados automaticamente

---

## 💳 3. PAGAMENTO

1. **Usuário escolhe plano**
2. **Clica em "Assinar"**
3. **Escolhe forma de pagamento:**
   - PIX
   - Cartão de Crédito
   - Boleto

4. **Após pagamento confirmado:**
   - API: `PUT /api/user/profile`
   - Atualiza:
     - `plan = '{planId}'`
     - `limit_products = {novo limite}`
     - `limit_freights = {novo limite}`
     - `plan_expires_at = +30 dias`

---

## 🏠 4. PAINEL DINÂMICO (`/user-dashboard`)

### Tabs exibidas conforme tipo:

#### 🛒 **Comprador:**
- Visão Geral
- **Pedidos** 🛒
- Mensagens
- Configurações

#### 🚛 **Freteiro:**
- Visão Geral
- **Fretes** 🚛
- Mensagens
- Configurações

#### 📦 **Anunciante:**
- Visão Geral
- **Produtos** 📦
- Mensagens
- Configurações

---

## 🔒 5. VALIDAÇÃO DE LIMITES

### Ao tentar criar produto:

```javascript
// 1. Verificar limite
GET /api/user/limits

// Response:
{
  "canAddProduct": true,
  "limits": { "products": 5 },
  "current": { "products": 3 },
  "available": { "products": 2 }
}

// 2. Se canAddProduct = false:
// Mostrar: "Limite atingido! Faça upgrade"
// Botão: "Ver Planos"

// 3. Se canAddProduct = true:
POST /api/products { ... }

// 4. Backend verifica novamente:
// - current_products < limit_products?
// - Se SIM: cria + incrementa current_products
// - Se NÃO: retorna 403
```

---

## 📊 ESTRUTURA DE DADOS

### Tabela `users`:
```sql
id                  INTEGER PRIMARY KEY
email               TEXT UNIQUE
name                TEXT
password            TEXT
business_type       TEXT DEFAULT 'all'     ← NOVO
plan                TEXT DEFAULT 'free'
limit_products      INTEGER DEFAULT 0      ← NOVO
limit_freights      INTEGER DEFAULT 0      ← NOVO
current_products    INTEGER DEFAULT 0      ← NOVO
current_freights    INTEGER DEFAULT 0      ← NOVO
plan_expires_at     DATETIME
created_at          INTEGER
```

### Tipos de conta:
- `all` - Indefinido (inicial)
- `comprador` - Comprador
- `freteiro` - Freteiro
- `anunciante` - Anunciante/Vendedor

### Limites especiais:
- `9999` = Ilimitado
- `0` = Bloqueado

---

## 🎉 SISTEMA COMPLETO FUNCIONANDO!

**Data:** 19/10/2025  
**Status:** ✅ PRODUÇÃO ESTÁVEL  
**Erros:** 0  
**Fluxo:** CORRETO

