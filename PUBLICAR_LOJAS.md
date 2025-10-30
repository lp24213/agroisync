# 🚀 GUIA COMPLETO PARA PUBLICAR NAS LOJAS

## ✅ CHECKLIST ANTES DE PUBLICAR

### 📋 Documentos (PRONTOS)
- [x] Política de Privacidade: `/politica-privacidade.html`
- [x] Termos de Uso: `/termos-uso.html`
- [x] Manifest.json configurado
- [x] Ícones gerados (Android + iOS)

### 🎨 Assets Necessários
- [x] Ícone 512x512 (Google Play)
- [x] Feature Graphic 1024x500 (Google Play)
- [x] Ícones iOS (14 tamanhos)
- [x] Splash Screens iOS (9 tamanhos)
- [ ] Screenshots mobile (4-8 imagens) ⚠️
- [ ] Screenshots desktop (opcional)

### 🔧 Configuração Técnica (PRONTO)
- [x] Capacitor configurado
- [x] Service Worker ativo
- [x] HTTPS ativo
- [x] PWA funcionando

---

## 📱 GOOGLE PLAY STORE

### 1. Preparação Inicial
1. Criar conta Google Play Console: https://play.google.com/console
   - Taxa única: R$ 25,00
   - Documentação necessária: CPF/CNPJ

2. Preparar APK ou AAB:
```bash
cd frontend
npm run build
npx cap add android
npx cap sync
npx cap open android
# No Android Studio: Build > Generate Signed Bundle / APK
```

### 2. Informações da Loja
- **Nome:** AgroSync - Futuro do Agronegócio
- **Descrição curta (80 chars):** Marketplace e fretes inteligentes para o agronegócio brasileiro
- **Descrição completa:**
```
A plataforma de agronegócio mais completa do Brasil!

🌾 MARKETPLACE COMPLETO
• Compre e venda produtos agrícolas
• Cotações em tempo real
• Busca avançada e filtros inteligentes

🚛 AGROCONECTA - FRETES INTELIGENTES
• Matching automático entre produtores e transportadores
• Rastreamento GPS em tempo real
• Rotas otimizadas e cálculo de custos

🤖 IA ESPECIALIZADA
• Chatbot com conhecimento em agronegócio
• Análise de mercado e tendências
• Recomendações personalizadas

🌤️ CLIMA E INSUMOS
• Previsão de 15 dias
• Cotações de insumos agrícolas
• Alertas meteorológicos

💳 PAGAMENTOS MODERNOS
• PIX instantâneo
• Cartão de crédito
• Criptomoedas

✅ CARACTERÍSTICAS:
• Interface moderna e intuitiva
• Funciona offline
• Notificações push
• Multi-idioma (PT, EN, ES, ZH)
• Segurança LGPD

Ideal para produtores rurais, compradores, transportadores e empresas do agronegócio.
```

### 3. Categorias e Classificação
- **Categoria:** Negócios
- **Classificação:** PEGI 3 / Livre
- **Palavras-chave:** agronegócio, marketplace, frete, soja, milho, agricultura

### 4. Screenshots Necessários
- Mínimo: 2 (máximo: 8)
- Resolução: 320px a 3840px
- Proporção: 16:9 ou 9:16
- **Como gerar:**
```bash
# Usar o app em um emulador ou dispositivo real
# Tirar screenshots das principais telas:
# - Home/Dashboard
# - Marketplace
# - Frete/AgroConecta
# - Chat IA
# - Clima e Insumos
```

### 5. Políticas e Termos
- Política de Privacidade: `https://agroisync.com/politica-privacidade.html`
- Termos de Uso: `https://agroisync.com/termos-uso.html`

### 6. Classificação de Conteúdo
- **Política de privacidade:** ✅
- **Permissões:** Localização (frete), Câmera (fotos), Armazenamento
- **Sensibilidade:** Baixa (apenas dados de negócios)

### 7. Preço e Distribuição
- **Preço:** Grátis (freemium)
- **Países:** Brasil (inicialmente)
- **Idade mínima:** 18 anos

### 8. Assinatura da App Bundle
```bash
# Criar keystore (primeira vez)
keytool -genkey -v -keystore agroisync-release.keystore -alias agroisync -keyalg RSA -keysize 2048 -validity 10000

# Assinar APK/AAB
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore agroisync-release.keystore app-release-unsigned.apk agroisync

# Otimizar APK
zipalign -v 4 app-release-unsigned.apk AgroSync.apk
```

---

## 🍎 APPLE APP STORE

### 1. Preparação Inicial
1. Criar conta Apple Developer: https://developer.apple.com
   - Taxa anual: US$ 99,00
   - Necessário: Conta Apple ID

2. Preparar IPA:
```bash
cd frontend
npm run build
npx cap add ios
npx cap sync
npx cap open ios
# No Xcode: Product > Archive > Distribute App
```

### 2. Informações da Loja
- **Nome:** AgroSync (máximo 30 caracteres)
- **Subtítulo:** Marketplace e Fretes para Agronegócio
- **Palavras-chave:** agronegócio,agricultura,marketplace,frete,soja,milho,insumos (máximo 100 chars)
- **Descrição:**
```
Plataforma completa de agronegócio com marketplace, fretes inteligentes e IA especializada.

Recursos principais:
• Marketplace de produtos agrícolas
• Sistema de fretes com rastreamento GPS
• Chatbot IA com conhecimento em agronegócio
• Previsão climática de 15 dias
• Cotações de insumos em tempo real
• Pagamentos via PIX, cartão e cripto

Perfeito para produtores, compradores e transportadores do setor agrícola.
```

### 3. Categorias
- **Categoria primária:** Negócios
- **Categoria secundária:** Produtividade
- **Classificação:** 4+ (Livre)

### 4. Screenshots iOS
- **iPhone 6.7" (iPhone 14 Pro Max):** 1290 x 2796 px
- **iPhone 6.5" (iPhone 11 Pro Max):** 1242 x 2688 px
- **iPhone 5.5":** 1242 x 2208 px
- **iPad Pro 12.9":** 2048 x 2732 px (opcional)
- **iPad Pro 11":** 1668 x 2388 px (opcional)

### 5. Políticas
- URL de Privacidade: `https://agroisync.com/politica-privacidade.html`
- Usar dados rastreados: Não (não rastreamos em diferentes apps/websites)

### 6. Informações de Suporte
- **Website:** https://agroisync.com
- **Suporte:** contato@agroisync.com
- **Marketing:** contato@agroisync.com

### 7. Preço
- **Preço:** Grátis (freemium - compras no app)
- **Compras no app:** Sim (planos premium)

---

## 🔧 COMANDOS RÁPIDOS

### Build para Android
```bash
cd frontend
npm run build
npx cap sync
npx cap open android
# No Android Studio, gerar signed bundle (AAB)
```

### Build para iOS
```bash
cd frontend
npm run build
npx cap sync
npx cap open ios
# No Xcode, Product > Archive > Distribute
```

### Gerar Screenshots (Automatizado)
```bash
# Instalar Playwright
npm install -D @playwright/test

# Criar script de captura de telas
node scripts/generate-screenshots.js
```

---

## 📝 CHECKLIST FINAL ANTES DE SUBMETER

### Google Play
- [ ] APK/AAB assinado e testado
- [ ] Feature Graphic 1024x500
- [ ] Ícone 512x512
- [ ] 2-8 screenshots (16:9 ou 9:16)
- [ ] Descrição completa preenchida
- [ ] Política de privacidade linkada
- [ ] Classificação de conteúdo preenchida
- [ ] Testado em diferentes dispositivos Android

### Apple App Store
- [ ] IPA gerado e testado
- [ ] Ícones iOS (14 tamanhos)
- [ ] Screenshots para diferentes iPhones/iPads
- [ ] Descrição preenchida
- [ ] Política de privacidade linkada
- [ ] Informações de suporte preenchidas
- [ ] Testado em diferentes dispositivos iOS

---

## 🎯 PRÓXIMOS PASSOS

1. **Gerar Screenshots** - Tirar screenshots das principais telas
2. **Testar Builds** - Instalar APK/AAB e IPA em dispositivos reais
3. **Preencher Informações** - Completar todas as seções nas lojas
4. **Submeter para Revisão** - Enviar para aprovação
5. **Aguardar Aprovação** - Google (1-3 dias) / Apple (1-7 dias)
6. **Publicar** - App disponível nas lojas!

---

## 📞 SUPORTE

Para questões sobre publicação:
- **E-mail:** contato@agroisync.com
- **Documentação Capacitor:** https://capacitorjs.com/docs
- **Google Play Help:** https://support.google.com/googleplay/android-developer
- **Apple App Store Connect:** https://developer.apple.com/support

---

**Última atualização:** 28 de outubro de 2025
