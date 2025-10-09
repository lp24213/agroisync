# Agroisync Next.js (SSR/SSG)

Plataforma de agronegócio com páginas pré-renderizadas para SEO otimizado.

## 🚀 Deploy no Cloudflare Pages

### Build e Deploy
```bash
# Instalar dependências
npm install

# Build para produção (gera .vercel/output para Cloudflare Pages)
npm run cf:build

# Deploy via Wrangler
npm run cf:deploy
# ou
wrangler pages deploy .vercel/output --project-name=agroisync
```

### Scripts Disponíveis
- `npm run dev` - Desenvolvimento local
- `npm run build` - Build padrão Next.js
- `npm run cf:build` - Build otimizado para Cloudflare Pages
- `npm run cf:deploy` - Deploy via Wrangler
- `npm run test:a11y` - Testes de acessibilidade
- `npm run ci:lhci` - Lighthouse CI

## 🔍 Verificação de SSR/SSG

### Testar HTML renderizado no servidor
```bash
# Local
npm run build && npm start
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

Copie `.env.example` para `.env.local` e configure:

```bash
# Cloudflare Turnstile (obrigatório para formulário de contato)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET=your_secret_key

# Resend para emails (obrigatório para formulário de contato)
RESEND_API_KEY=your_resend_key
CONTACT_TO_EMAIL=contato@agroisync.com

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# URL base para sitemap
SITE_URL=https://agroisync.com
```

## 🛡️ Recursos de Segurança

- ✅ Headers de segurança (HSTS, CSP, X-Frame-Options)
- ✅ Proteção contra spam com Cloudflare Turnstile
- ✅ Rate limiting no formulário de contato
- ✅ Sanitização de inputs
- ✅ Banner de consentimento LGPD/GDPR

## 📱 SEO e Acessibilidade

- ✅ SSR/SSG em todas as páginas principais
- ✅ Meta tags Open Graph e Twitter Cards
- ✅ Schema.org JSON-LD
- ✅ Sitemap.xml e robots.txt automáticos
- ✅ Estrutura semântica HTML5
- ✅ Navegação por teclado
- ✅ Alt text em imagens
- ✅ Labels associados a formulários
