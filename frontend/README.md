# AgroSync Frontend

Plataforma de agricultura inteligente e tokenização de ativos rurais.

## 🚀 Tecnologias

- **Next.js 13** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Heroicons** - Ícones SVG
- **React Hot Toast** - Notificações toast

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout
│   └── ui/            # Componentes de interface
├── pages/              # Páginas da aplicação
│   ├── api/           # API routes
│   └── ...            # Páginas públicas
├── styles/             # Estilos globais
└── types/              # Definições de tipos TypeScript
```

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd agroisync/frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.local.example env.local
   # Edite env.local com suas configurações
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🌐 Páginas Principais

- **/** - Página inicial
- **/marketplace** - Marketplace de produtos agrícolas
- **/staking** - Sistema de staking de tokens
- **/nfts** - Galeria de NFTs agrícolas
- **/dashboard** - Painel de controle
- **/contact** - Página de contato
- **/upload** - Upload de arquivos

## 🔧 Configurações

### TypeScript
- Configuração estrita para qualidade de código
- Verificação de tipos em tempo de compilação
- Suporte a decorators e metadados

### ESLint
- Regras configuradas para Next.js
- Integração com TypeScript
- Configuração profissional com warnings

### Next.js
- Configuração otimizada para produção
- Suporte a SSR e SSG
- Configuração de webpack personalizada

## 🚀 Deploy

### AWS Amplify
1. Conecte seu repositório ao AWS Amplify
2. Configure as variáveis de ambiente
3. Deploy automático a cada push para main

### Vercel
1. Conecte ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 📱 Responsividade

- Design mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Componentes adaptáveis para todos os dispositivos

## 🎨 Design System

### Cores
- **Primary**: Verde (#10B981)
- **Secondary**: Azul (#3B82F6)
- **Accent**: Roxo (#8B5CF6)
- **Neutral**: Cinza (#6B7280)

### Componentes
- **Button** - Botões com variantes e tamanhos
- **Card** - Cards para conteúdo
- **Input** - Campos de entrada
- **ToastProvider** - Sistema de notificações

## 🔒 Segurança

- Validação de entrada em todos os formulários
- Sanitização de dados
- Headers de segurança configurados
- CORS configurado adequadamente

## 📊 Performance

- Lazy loading de componentes
- Otimização de imagens
- Bundle splitting automático
- Cache de API routes

## 🧪 Testes

- Jest configurado
- Suporte a testes de componentes
- Mocks para APIs externas

## 📈 Monitoramento

- Integração com Sentry (configurável)
- Logs estruturados
- Métricas de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: contato@agroisync.com
- **Documentação**: [docs.agroisync.com](https://docs.agroisync.com)
- **Issues**: [GitHub Issues](https://github.com/agroisync/frontend/issues)

## 🔄 Changelog

### v1.0.0
- ✅ Sistema de autenticação
- ✅ Marketplace de produtos
- ✅ Sistema de staking
- ✅ Galeria de NFTs
- ✅ Dashboard administrativo
- ✅ Sistema de upload de arquivos
- ✅ Página de contato
- ✅ Layout responsivo
- ✅ Componentes de UI
- ✅ Configuração TypeScript
- ✅ Linting e formatação
- ✅ Deploy configurado

---

**Desenvolvido com ❤️ pela equipe AgroSync**
