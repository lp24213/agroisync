# 🚨 OBSOLETO: Migração para AWS

Todo conteúdo referente a Vercel/Railway foi descontinuado. Os deploys agora são exclusivamente na AWS (Amplify + ECS/ECR).

## 📊 Limites do Vercel Free Tier
- **Deploys por dia**: 100 (você atingiu o limite)
- **Tempo de espera**: 19 minutos para reset
- **Solução**: Upgrade para plano pago ou aguardar

---

## ✅ Deploys Exclusivos AWS
Frontend: AWS Amplify (main) com NEXT_PUBLIC_API_URL.
Backend: AWS ECS/ECR por GitHub Actions.

---

Toda referência a Vercel/Railway removida. Utilize apenas os guias de AWS neste repositório.

---

## 📋 CHECKLIST DE AÇÕES

### ✅ **Imediato (Agora)**
- [ ] Aguardar 19 minutos para reset do Vercel
- [ ] Verificar se o backend está funcionando no Railway
- [ ] Testar endpoints de health check

### ✅ **Após 19 minutos**
- [ ] Fazer novo push para GitHub
- [ ] Verificar se o deploy do Vercel funciona
- [ ] Testar frontend e backend

### ✅ **Alternativa (Se necessário)**
- [ ] Configurar Railway para frontend
- [ ] Modificar workflow para usar Railway para ambos
- [ ] Testar deploy completo

---

## 🔍 VERIFICAÇÃO ATUAL

### Backend Status:
Use o ALB/domínio AWS configurado (ex.: https://agrotmsol.com.br/health)

### Frontend Status:
- ❌ **Vercel**: Limitado (19 minutos)
- ✅ **Railway**: Disponível (alternativa)

---

## 💡 RECOMENDAÇÕES

Use exclusivamente AWS (Amplify para frontend; ECS/ECR para backend).

---

## 🎯 PRÓXIMOS PASSOS

1. Faça push na main
2. Verifique build no Amplify e deploy no ECS
3. Teste as URLs AWS