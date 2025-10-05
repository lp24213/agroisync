# 📊 Setup do Database D1 - AgroSync

## ⚡ Como aplicar o schema no D1

### **1. Criar o database (se não existir):**

```bash
wrangler d1 create agroisync-db
```

Copie o `database_id` gerado e cole no `wrangler.toml`.

### **2. Aplicar o schema:**

```bash
wrangler d1 execute agroisync-db --file=schema.sql
```

### **3. Verificar tabelas criadas:**

```bash
wrangler d1 execute agroisync-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### **4. Query de teste:**

```bash
wrangler d1 execute agroisync-db --command="SELECT COUNT(*) as total FROM users;"
```

---

## 📋 Tabelas Criadas

1. **users** - Usuários do sistema
2. **products** - Produtos para venda
3. **freight** - Ofertas de frete
4. **freight_orders** - Pedidos de frete
5. **partners** - Parceiros do sistema
6. **messages** - Mensagens entre usuários
7. **payments** - Pagamentos
8. **transactions** - Transações comerciais
9. **news** - Notícias
10. **gamification_points** - Pontos de gamificação
11. **secure_urls** - URLs seguras de convite
12. **contact_messages** - Mensagens de contato
13. **verification_codes** - Códigos de verificação de email

---

## 🔄 Migrations (Atualizações futuras)

Para adicionar novas colunas ou tabelas:

```bash
# Criar migration
echo "ALTER TABLE users ADD COLUMN new_field TEXT;" > migration_001.sql

# Aplicar migration
wrangler d1 execute agroisync-db --file=migration_001.sql
```

---

## 🚨 IMPORTANTE

- Sempre faça backup antes de migrations
- Teste em ambiente de desenvolvimento primeiro
- Use transações para operações críticas

---

## 📝 Comandos Úteis

### Backup:
```bash
wrangler d1 export agroisync-db > backup_$(date +%Y%m%d).sql
```

### Limpar todos os dados (CUIDADO!):
```bash
wrangler d1 execute agroisync-db --command="DELETE FROM users WHERE id IS NOT NULL;"
```

### Ver todos os usuários:
```bash
wrangler d1 execute agroisync-db --command="SELECT * FROM users LIMIT 10;"
```

