# AGROTM Frontend

Plataforma DeFi para Agricultura Sustentável na Solana - Frontend Next.js

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Solana Web3.js** - Integração blockchain

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_APP_URL` - URL da aplicação
   - `NEXT_PUBLIC_API_URL` - URL da API
   - `NEXT_PUBLIC_CHAIN_ID` - ID da rede Solana
   - `NEXT_PUBLIC_NETWORK` - Nome da rede

3. Deploy automático será executado

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `env.example`:

```bash
cp env.example .env.local
```

### Configurações Importantes

- **next.config.js** - Configuração do Next.js
- **tailwind.config.js** - Configuração do Tailwind CSS
- **tsconfig.json** - Configuração do TypeScript
- **vercel.json** - Configuração específica do Vercel

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── layout/           # Componentes de layout
│   └── sections/         # Seções da página
├── contexts/             # Contextos React
├── hooks/                # Custom hooks
├── lib/                  # Utilitários
├── public/               # Arquivos estáticos
└── types/                # Definições TypeScript
```

## 🎨 Design System

### Cores

- `agro-dark` - Fundo escuro principal
- `agro-darker` - Fundo mais escuro
- `agro-blue` - Azul principal
- `agro-green` - Verde principal
- `agro-purple` - Roxo principal
- `agro-neon` - Verde neon

### Componentes

- **Button** - Botões com múltiplas variantes
- **Card** - Cards com efeitos visuais
- **LoadingSpinner** - Indicadores de carregamento
- **Layout** - Layout principal da aplicação

## 🔒 Segurança

- Headers de segurança configurados
- Validação de entrada
- Sanitização de dados
- Proteção contra XSS

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Performance

- Otimização de imagens
- Lazy loading
- Code splitting
- Bundle optimization
- CDN ready

## 🐛 Debugging

Para debug em desenvolvimento:

```bash
# Logs detalhados
DEBUG=* npm run dev

# Build com análise
npm run build && npm run analyze
```

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato:
- Email: support@agrotm.com
- Discord: https://discord.gg/agrotm
- GitHub Issues: https://github.com/agrotm/frontend/issues 