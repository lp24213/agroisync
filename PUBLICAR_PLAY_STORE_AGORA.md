# 🚀 PUBLICAR AGROISYNC NA PLAY STORE - PASSO A PASSO

## ✅ STATUS: QUASE PRONTO!

### O que JÁ TEM:
- ✅ Projeto Android criado (`frontend/android/`)
- ✅ Assets sincronizados (build copiado)
- ✅ Ícones Android (192px e 512px)
- ✅ Screenshots mobile (6 imagens)
- ✅ Feature Graphic (1024x500)
- ✅ Política de Privacidade
- ✅ Termos de Uso
- ✅ Capacitor configurado

### O que FALTA:
- ❌ Gerar APK/AAB assinado
- ❌ Testar em dispositivo Android
- ❌ Preencher formulário da Play Store
- ❌ Submeter para revisão

---

## 📋 PASSO A PASSO COMPLETO

### **PASSO 1: Instalar Android Studio** (se não tiver)

1. Baixar: https://developer.android.com/studio
2. Instalar tudo (Android SDK, emulador, etc)
3. Abrir Android Studio
4. Configure → SDK Manager → Instalar:
   - Android API 34 (Android 14)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

---

### **PASSO 2: Abrir Projeto no Android Studio**

```powershell
# Na pasta frontend
npx cap open android
```

Isso vai abrir o Android Studio com o projeto!

---

### **PASSO 3: Gerar Keystore (Chave de Assinatura)**

**IMPORTANTE:** Guarde bem essa chave! Se perder, não consegue atualizar o app!

```powershell
# Criar keystore (primeira vez apenas)
cd android/app

keytool -genkey -v -keystore agroisync-release.keystore -alias agroisync -keyalg RSA -keysize 2048 -validity 10000

# Vai pedir:
# - Senha (crie uma forte e ANOTE!)
# - Nome: AgroSync
# - Organização: AgroSync
# - Cidade: Sinop
# - Estado: MT
# - País: BR
```

**ANOTAR:**
- Keystore Password: _____________
- Key Alias: agroisync
- Key Password: _____________

---

### **PASSO 4: Configurar Assinatura no Android Studio**

1. No Android Studio, clique em: **Build → Generate Signed Bundle / APK**
2. Escolha: **Android App Bundle (AAB)** (recomendado pela Google)
3. Create new keystore ou use existing:
   - Keystore path: `android/app/agroisync-release.keystore`
   - Keystore password: (a senha que você criou)
   - Key alias: agroisync
   - Key password: (a senha que você criou)
4. Next
5. Build Variant: **release**
6. Signature Versions: V1 e V2 (ambos marcados)
7. Finish

**Resultado:** Arquivo `app-release.aab` gerado em `android/app/release/`

---

### **PASSO 5: Testar no Dispositivo** (RECOMENDADO!)

#### Opção A: Emulador
1. No Android Studio: Tools → Device Manager
2. Create Device → Pixel 5 (recomendado)
3. Run app

#### Opção B: Dispositivo Real
1. No seu celular: Configurações → Sobre → Toque 7x em "Número da versão"
2. Ative "Opções do desenvolvedor"
3. Ative "Depuração USB"
4. Conecte no PC via USB
5. No Android Studio: Run

---

### **PASSO 6: Criar Conta Google Play Console**

1. Acesse: https://play.google.com/console
2. **Taxa única:** R$ 25,00 (pagamento via cartão)
3. Preencha dados:
   - Nome do desenvolvedor: AgroSync ou seu nome
   - Email: contato@agroisync.com
   - Telefone: (66) 99236-2830

---

### **PASSO 7: Criar Novo App na Play Console**

1. No Play Console: **Create app**
2. Preencha:
   - **App name:** AgroSync - Futuro do Agronegócio
   - **Default language:** Português (Brasil)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Aceite todos os termos

---

### **PASSO 8: Preencher Informações do App**

#### **Dashboard → App details:**

**Detalhes do app:**
- Nome: AgroSync - Futuro do Agronegócio
- Descrição curta (80 chars):
  ```
  Marketplace + Frete + IA. Tudo para o agronegócio em um só lugar.
  ```

- Descrição completa:
  ```
  🌾 AGROISYNC - A PLATAFORMA COMPLETA DO AGRONEGÓCIO
  
  A plataforma mais moderna para produtores rurais, compradores e transportadores.
  
  ✨ PRINCIPAIS FUNCIONALIDADES:
  
  🏪 MARKETPLACE COMPLETO
  • Compra e venda de produtos agrícolas
  • Grãos, insumos, maquinários, animais e muito mais
  • Sistema de avaliações e verificações
  
  🚛 FRETES E LOGÍSTICA INTELIGENTE
  • Busca de fretes e ofertas de carga
  • Rastreamento GPS em tempo real
  • Cálculo inteligente de rotas
  
  🤖 IA INTEGRADA
  • Chatbot especializado em agronegócio
  • Respostas sobre preços, clima, mercado
  • Reconhecimento de voz e imagens
  
  🌤️ CLIMA E INSUMOS
  • Previsão de 15 dias
  • Dados de Mato Grosso, Bahia, Goiás, Paraná
  • Alertas climáticos
  
  📊 COTAÇÕES EM TEMPO REAL
  • Preços de soja, milho, café, boi gordo
  • Atualização automática
  
  💳 PAGAMENTOS MODERNOS
  • PIX instantâneo
  • Cartão em até 12x
  • Boleto bancário
  
  📍 CONTATO
  Sinop - MT, Brasil
  (66) 99236-2830
  contato@agroisync.com
  
  Baixe agora e transforme seu agronegócio!
  ```

- **App icon:** Upload `frontend/public/icon-512.png`
- **Feature Graphic:** Upload `frontend/public/feature-graphic.png`
- **Categoria:** Business
- **Email de contato:** contato@agroisync.com
- **Telefone:** +55 66 99236-2830
- **Website:** https://agroisync.com
- **Política de privacidade:** https://agroisync.com/politica-privacidade.html

#### **Screenshots:**
- Upload mínimo 2 screenshots
- Arquivos: `screenshot-mobile-1.png` até `screenshot-mobile-6.png`

---

### **PASSO 9: Classificação de Conteúdo**

1. Dashboard → **Content rating**
2. Preencher questionário:
   - Violência: Não
   - Sexo: Não
   - Drogas: Não
   - Linguagem ofensiva: Não
   - **Resultado:** PEGI 3 / Livre

---

### **PASSO 10: Configurar Preços e Distribuição**

1. Dashboard → **Countries / regions**
   - Selecionar: Brasil (inicialmente)
   - Preço: Gratuito

2. **In-app products:** Sim (planos premium)
   - Básico: R$ 29,90/mês
   - Profissional: R$ 59,90/mês
   - Premium: R$ 99,90/mês

---

### **PASSO 11: Upload do APK/AAB**

1. Dashboard → **Release → Production**
2. Create new release
3. Upload: `android/app/release/app-release.aab`
4. Preencher:
   - Release name: 1.0.0
   - Release notes:
     ```
     🎉 Lançamento inicial do AgroSync!
     
     ✅ Marketplace completo
     ✅ Sistema de fretes inteligente
     ✅ IA especializada em agronegócio
     ✅ Clima e cotações em tempo real
     ✅ Pagamentos via PIX, cartão e boleto
     ```

---

### **PASSO 12: Submeter para Revisão**

1. Review → **Submit for review**
2. **Tempo de aprovação:** 1-7 dias
3. Google vai revisar:
   - Funcionalidade
   - Conteúdo
   - Segurança
   - Políticas

---

## ⚡ COMANDOS RÁPIDOS PARA VOCÊ RODAR:

```powershell
# 1. Abrir Android Studio
cd frontend
npx cap open android

# 2. No Android Studio:
# - Build → Generate Signed Bundle (AAB)
# - Usar keystore que criou
# - Gerar release

# 3. Testar (opcional):
# - Run no emulador ou dispositivo
```

---

## 📱 **VOCÊ TEM ANDROID STUDIO INSTALADO?**

Se **SIM:** Roda `npx cap open android` e gera o AAB assinado!  
Se **NÃO:** Instala primeiro: https://developer.android.com/studio

---

## 🎯 CHECKLIST FINAL:

- [x] Projeto Android criado
- [x] Assets sincronizados
- [x] Ícones prontos
- [x] Screenshots prontos
- [ ] **Android Studio instalado?**
- [ ] **Gerar AAB assinado**
- [ ] **Criar conta Play Console** ($25)
- [ ] **Upload e submissão**

---

## 💡 **PRÓXIMO PASSO:**

**Você tem Android Studio instalado?**

- **SIM:** Vou te guiar para gerar o AAB e publicar!
- **NÃO:** Instala agora ou eu faço um APK não-assinado para você testar primeiro!

**RESPONDE MERMÃO!** 🚀
