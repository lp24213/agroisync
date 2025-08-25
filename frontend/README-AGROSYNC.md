# AGROSYNC - Sistema de Autenticação e Administração

## 🚀 Visão Geral

O AGROSYNC é uma plataforma agrícola completa com sistema de autenticação robusto, painel administrativo futurista e dashboard para usuários comuns.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- **Login único** para admin e usuários comuns
- **Redirecionamento automático** baseado no tipo de usuário
- **Cookies httpOnly** para máxima segurança
- **JWT tokens** com expiração automática
- **Proteção de rotas** com middleware integrado

### 👑 Painel Administrativo
- **Layout futurista**: Preto fosco + azul neon
- **Dashboard completo** com estatísticas em tempo real
- **CRUD de usuários** com filtros e busca
- **Gráficos interativos** de receita e distribuição regional
- **Analytics avançados** com métricas de crescimento
- **Configurações do sistema** centralizadas

### 👤 Dashboard de Usuários
- **Interface limpa** e profissional
- **Gestão de produtos** pessoais
- **Estatísticas individuais** de vendas
- **Atividade recente** em tempo real
- **Perfil e configurações** personalizadas

## 🔑 Credenciais de Acesso

### Admin Fixo
```
Email: luispaulodeoliveira@agrotm.com.br
Senha: Th@ys15221008
```
- Acesso total ao sistema
- Painel administrativo completo
- Gestão de todos os usuários
- Analytics e relatórios

### Usuários Comuns
```
Email: qualquer@email.com
Senha: mínimo 6 caracteres
```
- Dashboard personalizado
- Gestão de produtos próprios
- Estatísticas individuais

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + React Router
- **Autenticação**: Mock AWS Cognito (simulado)
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Cookies**: js-cookie
- **JWT**: jwt-decode

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── RouteGuard.js          # Proteção de rotas
│   │   └── ProtectedRoute.js      # Componente de proteção
│   ├── contexts/
│   │   └── AuthContext.js         # Contexto de autenticação
│   ├── pages/
│   │   ├── Login.js               # Página de login
│   │   ├── Admin.js               # Painel administrativo
│   │   └── Dashboard.js           # Dashboard de usuários
│   ├── services/
│   │   └── cognitoAuthService.js  # Serviço de autenticação
│   └── config/
│       └── app.config.js          # Configurações centralizadas
├── config/
│   └── app.config.js              # Configurações da aplicação
└── README-AGROSYNC.md             # Esta documentação
```

## 🚀 Como Usar

### 1. Instalação
```bash
cd frontend
npm install
```

### 2. Configuração
O sistema já está configurado com as credenciais de admin fixas. Para personalizar:

Edite `config/app.config.js`:
```javascript
admin: {
  email: 'seu@email.com',
  password: 'suasenha123'
}
```

### 3. Execução
```bash
npm start
```

### 4. Acesso
- **Admin**: `/admin` (após login com credenciais admin)
- **Usuários**: `/dashboard` (após login com qualquer email)
- **Login**: `/login`

## 🔒 Segurança

### Proteção de Rotas
- **`/admin`**: Apenas usuários com grupo `admin`
- **`/dashboard`**: Apenas usuários autenticados
- **Middleware automático** em todas as rotas protegidas

### Autenticação
- **Cookies httpOnly** (não acessíveis via JavaScript)
- **JWT tokens** com expiração automática
- **Verificação de grupos** para controle de acesso
- **Logout automático** em tokens expirados

### Validações
- **Credenciais admin** fixas e seguras
- **Verificação de email** para usuários comuns
- **Senha mínima** de 6 caracteres
- **Proteção contra** acesso não autorizado

## 📊 Funcionalidades do Admin

### Dashboard Principal
- **Estatísticas em tempo real** de usuários e receita
- **Gráficos interativos** de crescimento mensal
- **Distribuição regional** de usuários
- **Métricas de sistema** e saúde da plataforma

### Gestão de Usuários
- **Lista completa** com filtros e busca
- **CRUD completo** (Criar, Ler, Atualizar, Deletar)
- **Status de usuários** (Ativo, Inativo, Pendente)
- **Planos e receita** individual
- **Exportação de dados** e relatórios

### Analytics
- **Métricas de vendas** e pedidos
- **Crescimento mensal** de usuários e receita
- **Distribuição de planos** (Premium vs Basic)
- **Tendências regionais** e de mercado

### Configurações
- **Nome da plataforma** personalizável
- **Email de contato** configurável
- **Região padrão** do sistema
- **Features habilitadas** por ambiente

## 👤 Funcionalidades dos Usuários

### Dashboard Pessoal
- **Estatísticas individuais** de produtos e vendas
- **Atividade recente** em tempo real
- **Gestão de produtos** pessoais
- **Histórico de pedidos** e transações

### Gestão de Produtos
- **Adicionar produtos** com categorias
- **Editar informações** e preços
- **Visualizar estatísticas** de cada produto
- **Status de listagens** (Ativo, Pendente)

### Perfil e Configurações
- **Informações pessoais** editáveis
- **Preferências** de notificações
- **Configurações** de privacidade
- **Histórico** de atividades

## 🔧 Configurações Avançadas

### Variáveis de Ambiente
```bash
# Desenvolvimento
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_MOCK_DATA=true

# Produção
REACT_APP_API_URL=https://api.agrosync.com
REACT_APP_ENABLE_DEBUG=false
REACT_APP_ENABLE_MOCK_DATA=false
```

### Personalização de Temas
O sistema suporta temas personalizáveis através do `ThemeContext`:
- **Modo claro/escuro** automático
- **Cores personalizáveis** por ambiente
- **Layouts responsivos** para mobile

### Integração com APIs
O sistema está preparado para integração com:
- **AWS Cognito real** (substituir mock)
- **MongoDB** para persistência de dados
- **APIs externas** para dados agrícolas
- **Sistemas de pagamento** (Stripe, etc.)

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Login não funciona
- Verificar se as credenciais estão corretas
- Limpar cookies do navegador
- Verificar console para erros

#### 2. Acesso negado a rotas
- Verificar se o usuário está logado
- Confirmar se tem permissões de admin
- Verificar se o token não expirou

#### 3. Página não carrega
- Verificar se todas as dependências estão instaladas
- Limpar cache do navegador
- Verificar logs do console

### Logs e Debug
```javascript
// Habilitar logs detalhados
localStorage.setItem('agrosync_debug', 'true');

// Verificar status de autenticação
console.log('Auth Status:', await cognitoAuthService.checkAuthStatus());
```

## 📈 Roadmap

### Versão 1.1
- [ ] Integração real com AWS Cognito
- [ ] Banco de dados MongoDB
- [ ] Sistema de notificações push
- [ ] Chat em tempo real

### Versão 1.2
- [ ] App mobile React Native
- [ ] Integração com APIs agrícolas
- [ ] Sistema de pagamentos
- [ ] Relatórios avançados

### Versão 2.0
- [ ] IA para análise de dados
- [ ] Marketplace integrado
- [ ] Sistema de frete inteligente
- [ ] Integração com IoT agrícola

## 🤝 Contribuição

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico:
- **Email**: suporte@agrosync.com
- **Documentação**: [docs.agrosync.com](https://docs.agrosync.com)
- **Issues**: [GitHub Issues](https://github.com/agroisync/agroisync/issues)

---

**AGROSYNC** - Transformando o agronegócio através da tecnologia 🚀
