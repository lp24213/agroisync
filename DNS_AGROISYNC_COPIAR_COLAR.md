# 🌐 CONFIGURAÇÃO DNS - AGROISYNC.COM
## COPIAR E COLAR DIRETO!

---

## 📌 REGISTROS PRINCIPAIS DO DOMÍNIO

### 1️⃣ Registro A (Domínio Principal)
```
Tipo: A
Nome: @
Aponta para: 76.76.21.21
TTL: Auto (ou 300)
Proxy: ✅ Ativado (nuvem laranja)
Prioridade: -
```

### 2️⃣ Registro CNAME (WWW)
```
Tipo: CNAME
Nome: www
Aponta para: agroisync.pages.dev
TTL: Auto (ou 300)
Proxy: ✅ Ativado
Prioridade: -
```

### 3️⃣ Registro CNAME (API)
```
Tipo: CNAME
Nome: api
Aponta para: agroisync.pages.dev
TTL: Auto (ou 300)
Proxy: ✅ Ativado
Prioridade: -
```

---

## 📧 REGISTROS DE EMAIL (RESEND)

### SE você JÁ VERIFICOU DOMÍNIO NO RESEND, adicione:

### 4️⃣ Registro MX (Email)
```
Tipo: MX
Nome: @
Aponta para: feedback-smtp.us-east-1.amazonses.com
TTL: Auto (ou 3600)
Proxy: ❌ Desativado (cinza)
Prioridade: 10
```

### 5️⃣ Registro TXT (SPF)
```
Tipo: TXT
Nome: @
Conteúdo: v=spf1 include:amazonses.com ~all
TTL: Auto (ou 3600)
Proxy: ❌ Desativado
Prioridade: -
```

### 6️⃣ Registro TXT (DKIM) - Resend vai te dar
```
Tipo: TXT
Nome: resend._domainkey
Conteúdo: (Resend vai fornecer - começa com v=DKIM1;)
TTL: Auto (ou 3600)
Proxy: ❌ Desativado
Prioridade: -
```

### 7️⃣ Registro TXT (DMARC)
```
Tipo: TXT
Nome: _dmarc
Conteúdo: v=DMARC1; p=none; rua=mailto:contato@agroisync.com
TTL: Auto (ou 3600)
Proxy: ❌ Desativado
Prioridade: -
```

---

## 🎯 COPIAR E COLAR:

**Para cada registro, preencha EXATAMENTE assim:**

| Campo | O que Colocar |
|-------|---------------|
| **Nome** | O valor da coluna "Nome" acima |
| **Tipo** | A, CNAME, TXT ou MX |
| **Aponta para / Conteúdo** | O valor exato da coluna "Aponta para" |
| **TTL** | Auto ou 300 |
| **Proxy** | ✅ Ativado para A/CNAME do site, ❌ Desativado para email |
| **Prioridade** | Só para MX = 10 |

---

## ⚠️ SE ESTÁ CONFIGURANDO EMAIL:

**ANTES de adicionar registros MX/TXT:**

1. Vá em Resend: https://resend.com/domains
2. Adicione: agroisync.com
3. **Copie os valores EXATOS** que o Resend te mostrar
4. Use ESSES valores (não os genéricos acima)

**Resend vai te dar algo tipo:**
```
MX: feedback-smtp.us-east-1.amazonses.com (prioridade 10)
TXT (SPF): v=spf1 include:amazonses.com ~all
TXT (DKIM): [valor único gerado pelo Resend]
```

---

## 🚀 QUAL REGISTRO VOCÊ TÁ TENTANDO ADICIONAR AGORA?

Me diz que eu te dou os valores EXATOS! 🎯

