# Agroisync Frontend - SEO & Security Enhanced

Plataforma de agronegócio com React, otimizada para SEO, performance e segurança.

## 🚀 Deploy no Cloudflare Pages

### Build e Deploy
```bash
# Instalar dependências
npm install

# Build para produção
npm run cf:build

# Deploy via Wrangler
npm run cf:deploy
# ou
wrangler pages deploy build --project-name=agroisync
```

### Scripts Disponíveis
- `npm run dev` - Desenvolvimento local
- `npm run build` - Build padrão React
- `npm run cf:build` - Build otimizado para Cloudflare Pages
- `npm run cf:deploy` - Deploy via Wrangler
- `npm run test:a11y` - Testes de acessibilidade
- `npm run ci:lhci` - Lighthouse CI
- `npm run generate:csp` - Gerar hashes CSP

## 🔍 Verificação de Performance

### Testar aplicação localmente
```bash
# Local
npm run build && npm run ci:start
curl -L http://localhost:3000/ | head -50

# Produção
curl -L https://agroisync.com/ | head -50
```

### Verificar robots.txt e sitemap.xml
```bash
curl -I https://agroisync.com/robots.txt
curl -I https://agroisync.com/sitemap.xml
```

## 📊 Testes de Performance

### Lighthouse
```bash
# Local
npx lighthouse http://localhost:3000 --output html --output-path=./lighthouse.html

# Produção
npx lighthouse https://agroisync.com --output html --output-path=./lighthouse-prod.html
```

### Acessibilidade
```bash
npm run test:a11y
```

## 🔧 Configuração de Ambiente

Copie `env.example` para `.env` e configure:

```bash
# Cloudflare Turnstile (obrigatório para formulário de contato)
REACT_APP_TURNSTILE_SITE_KEY=your_site_key
REACT_APP_TURNSTILE_SECRET=your_secret_key

# Google Analytics (opcional)
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# API Configuration
REACT_APP_API_URL=https://agroisync.com/api
```

## 🛡️ Recursos de Segurança

- ✅ Headers de segurança (HSTS, CSP, X-Frame-Options)
- ✅ Proteção contra spam com Cloudflare Turnstile
- ✅ Rate limiting no formulário de contato
- ✅ Sanitização de inputs
- ✅ Banner de consentimento LGPD/GDPR

## 📱 SEO e Acessibilidade

- ✅ Meta tags Open Graph e Twitter Cards
- ✅ Schema.org JSON-LD
- ✅ Sitemap.xml e robots.txt otimizados
- ✅ Estrutura semântica HTML5
- ✅ Navegação por teclado
- ✅ Alt text em imagens
- ✅ Labels associados a formulários

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   ├── ConsentBanner.js      # Banner LGPD/GDPR
│   └── SecureContactForm.js  # Formulário seguro
├── pages/         # Páginas da aplicação
├── contexts/      # Context API
├── hooks/         # Custom hooks
├── utils/         # Utilitários
│   └── csp-hashes.js        # Hashes CSP gerados
├── api/           # Funções de API
│   └── contact.js           # API de contato segura
├── styles/        # Estilos CSS
└── assets/        # Imagens e recursos
```

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados
- **@marsidev/react-turnstile** - Proteção Cloudflare Turnstile

## 🌐 Deploy e CI/CD

O projeto está configurado para deploy no Cloudflare Pages com:

- Build automático via GitHub Actions
- Testes de performance com Lighthouse CI
- Testes de acessibilidade com axe-core
- Headers de segurança configurados
- Cache otimizado para assets

```bash
# Build e deploy
npm run cf:build
npm run cf:deploy
```

## 📝 Licença

MIT
