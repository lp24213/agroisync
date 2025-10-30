# ✅ REQUISITOS PARA PUBLICAÇÃO NAS LOJAS - STATUS

## 📄 DOCUMENTOS LEGAIS

### ✅ Política de Privacidade
- **Status:** ✅ PRONTO
- **Localização:** `/frontend/public/politica-privacidade.html`
- **URL:** `https://agroisync.com/politica-privacidade.html`
- **Conformidade:** LGPD ✅
- **Seções:** Coleta, uso, compartilhamento, direitos, segurança ✅

### ✅ Termos de Uso
- **Status:** ✅ PRONTO
- **Localização:** `/frontend/public/termos-uso.html`
- **URL:** `https://agroisync.com/termos-uso.html`
- **Seções:** Uso, responsabilidades, transações, pagamentos ✅

---

## 🎨 ASSETS VISUAIS

### ✅ Ícones
- **Android (6 tamanhos):** ✅ PRONTO
  - 48x48, 72x72, 96x96, 144x144, 192x192, 512x512
  - Localização: `frontend/public/app-icons/android/`
  
- **iOS (14 tamanhos):** ✅ PRONTO
  - 20x20 até 1024x1024
  - Localização: `frontend/public/app-icons/ios/`

- **Ícones principais:** ✅ PRONTO
  - `icon-192.png` e `icon-512.png` em `/public`

### ✅ Feature Graphic (Google Play)
- **Status:** ✅ PRONTO
- **Tamanho:** 1024x500px
- **Localização:** `frontend/public/feature-graphic.png`

### ✅ Splash Screens iOS
- **Status:** ✅ PRONTO
- **9 tamanhos:** iPhone 4.0" até iPad 12.9"
- **Localização:** `frontend/public/app-icons/ios/splash/`

### ⚠️ Screenshots
- **Status:** ⚠️ PENDENTE (gera manualmente)
- **Google Play:** 2-8 imagens (16:9 ou 9:16)
- **Apple:** Diferentes resoluções para iPhones/iPads
- **Script auxiliar:** `scripts/generate-screenshots.js` ✅

---

## 🔧 CONFIGURAÇÃO TÉCNICA

### ✅ PWA
- **Service Worker:** ✅ Ativo (`sw.js`)
- **Manifest.json:** ✅ Configurado
- **HTTPS:** ✅ Cloudflare Pages
- **Ícones no manifest:** ✅ 192px e 512px

### ✅ Capacitor
- **Status:** ✅ INSTALADO E CONFIGURADO
- **Config:** `capacitor.config.ts`
- **App ID:** `com.agroisync.app`
- **Nome:** AgroSync
- **Scripts npm:** ✅ Adicionados

### ✅ Build Scripts
```json
"cap:add:android": "npm run build && npx cap add android"
"cap:add:ios": "npm run build && npx cap add ios"
"cap:sync": "npx cap sync"
"cap:open:android": "npx cap open android"
"cap:open:ios": "npx cap open ios"
"cap:build:android": "npm run build && npx cap sync && npx cap open android"
"cap:build:ios": "npm run build && npx cap sync && npx cap open ios"
```

---

## 📱 GOOGLE PLAY STORE - REQUISITOS

### ✅ Documentação
- [x] Política de Privacidade (URL)
- [x] Ícone 512x512
- [x] Feature Graphic 1024x500
- [x] Manifest.json com links para política/termos

### ⚠️ Pendente
- [ ] Screenshots (2-8 imagens)
- [ ] Descrição completa (texto)
- [ ] Classificação de conteúdo (preencher formulário)
- [ ] APK/AAB assinado
- [ ] Conta Google Play Console (R$ 25)

### 📝 Informações Necessárias
- Nome: AgroSync - Futuro do Agronegócio
- Descrição curta: Marketplace e fretes inteligentes para o agronegócio brasileiro
- Categoria: Negócios
- Classificação: Livre (PEGI 3)
- Preço: Grátis (freemium)

---

## 🍎 APPLE APP STORE - REQUISITOS

### ✅ Documentação
- [x] Política de Privacidade (URL)
- [x] Ícones iOS (14 tamanhos)
- [x] Splash Screens (9 tamanhos)
- [x] Capacitor configurado

### ⚠️ Pendente
- [ ] Screenshots iOS (diferentes tamanhos de iPhone/iPad)
- [ ] Descrição (texto - máximo 4000 chars)
- [ ] Subtítulo (máximo 30 chars)
- [ ] Palavras-chave (máximo 100 chars)
- [ ] Informações de suporte
- [ ] IPA assinado
- [ ] Conta Apple Developer (US$ 99/ano)

### 📝 Informações Necessárias
- Nome: AgroSync (máx 30 chars)
- Subtítulo: Marketplace e Fretes para Agronegócio
- Categoria: Negócios / Produtividade
- Classificação: 4+ (Livre)
- Preço: Grátis (com compras no app)

---

## 🚀 PRÓXIMOS PASSOS

### 1. Gerar Screenshots ⚠️
```bash
# Opção 1: Manual
# - Abra app no navegador
# - Use DevTools modo dispositivo
# - Capture telas principais
# - Salve em frontend/public/

# Opção 2: Automatizado (requer Playwright)
npm install -D @playwright/test playwright
npx playwright install
node scripts/generate-screenshots.js
```

**Telas a capturar:**
- Home/Dashboard
- Marketplace de produtos
- AgroConecta (fretes)
- Clima e Insumos
- Chat IA (se possível)
- Perfil/Configurações

### 2. Build para Android
```bash
cd frontend
npm run build
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
# No Android Studio: Build > Generate Signed Bundle
```

### 3. Build para iOS
```bash
cd frontend
npm run build
npm run cap:add:ios
npm run cap:sync
npm run cap:open:ios
# No Xcode: Product > Archive > Distribute
```

### 4. Preencher Informações nas Lojas
- Seguir guia em `PUBLICAR_LOJAS.md`
- Copiar descrições e metadados
- Upload de screenshots
- Configurar preços e categorias

---

## ✅ CHECKLIST FINAL

### Google Play
- [x] Política de Privacidade
- [x] Termos de Uso
- [x] Ícones gerados
- [x] Feature Graphic
- [x] Capacitor configurado
- [ ] Screenshots (2-8)
- [ ] APK/AAB assinado
- [ ] Conta Play Console
- [ ] Informações preenchidas
- [ ] Submetido para revisão

### Apple App Store
- [x] Política de Privacidade
- [x] Termos de Uso
- [x] Ícones iOS gerados
- [x] Splash Screens
- [x] Capacitor configurado
- [ ] Screenshots iOS
- [ ] IPA assinado
- [ ] Conta Apple Developer
- [ ] Informações preenchidas
- [ ] Submetido para revisão

---

## 📞 CONTATO

Para questões sobre publicação:
- **E-mail:** contato@agroisync.com
- **Documentação:** Ver `PUBLICAR_LOJAS.md`

---

**Status:** ✅ 90% PRONTO - Falta apenas gerar screenshots e builds assinados

**Última atualização:** 28 de outubro de 2025
