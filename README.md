# AGROTM - Revolutionary DeFi & NFT Platform for Agriculture

[![AGROTM Logo](https://agrotm.com/logo.png)](https://agrotm.com)

> **AGROTM** is a cutting-edge DeFi and NFT platform built on Solana blockchain, revolutionizing agricultural finance through decentralized technology.

## 🚀 Features

- **🌾 Agricultural DeFi**: Staking, liquidity pools, and yield farming for agricultural tokens
- **🎨 NFT Marketplace**: Digital assets representing real agricultural products
- **🔗 Cross-Chain Integration**: Solana and Ethereum support
- **📊 Real-time Analytics**: Advanced dashboard with live data
- **🔐 Secure Authentication**: Web3 wallet integration
- **📱 Mobile-First Design**: Responsive PWA with offline support
- **🌍 Multi-Language**: Internationalization support
- **⚡ High Performance**: Optimized for speed and scalability

## 🏗️ Architecture

```
agrotm-solana/
├── frontend/                 # Next.js React application
├── backend/                  # Node.js Express API
├── contracts/               # Solana smart contracts
├── .github/workflows/       # CI/CD pipelines
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
└── utils/                   # Shared utilities
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Web3.js** - Blockchain interaction

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Winston** - Logging
- **Jest** - Testing

### Blockchain
- **Solana** - Primary blockchain
- **Anchor** - Solana development framework
- **@solana/web3.js** - Solana JavaScript SDK
- **SPL Token** - Token standard

### DevOps
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend deployment
- **Railway** - Backend deployment
- **Docker** - Containerization
- **Lighthouse CI** - Performance monitoring

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher
- MongoDB 6.x or higher
- Redis 7.x or higher
- Solana CLI tools

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/agrotm-solana.git
   cd agrotm-solana
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start frontend
   pnpm frontend:dev
   
   # Start backend (in another terminal)
   pnpm backend:dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start both frontend and backend
pnpm frontend:dev          # Start frontend only
pnpm backend:dev           # Start backend only

# Building
pnpm build                 # Build frontend
pnpm backend:build         # Build backend

# Testing
pnpm test                  # Run all tests
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Generate coverage report
pnpm test:e2e             # Run end-to-end tests

# Linting and Formatting
pnpm lint                  # Run ESLint
pnpm lint:fix             # Fix ESLint errors
pnpm format               # Format code with Prettier
pnpm format:check         # Check code formatting

# Type Checking
pnpm type-check           # Run TypeScript compiler

# Security
pnpm security:audit       # Run security audit
pnpm security:fix         # Fix security vulnerabilities

# Database
pnpm db:migrate           # Run database migrations
pnpm db:seed              # Seed database with test data
pnpm db:reset             # Reset database

# Docker
pnpm docker:build         # Build Docker image
pnpm docker:run           # Run Docker container
pnpm docker:compose       # Start with Docker Compose
```

### Project Structure

```
frontend/
├── app/                   # Next.js App Router pages
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions

backend/
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
├── __tests__/             # Test files
└── scripts/               # Build and deployment scripts

contracts/
├── programs/              # Solana programs
├── tests/                 # Contract tests
└── migrations/            # Deployment scripts
```

## 🌐 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/verify
```

### Staking Endpoints

```http
GET  /api/staking/pools
GET  /api/staking/positions
POST /api/staking/stake
POST /api/staking/unstake
POST /api/staking/claim-rewards
```

### DeFi Endpoints

```http
GET  /api/defi/pools
GET  /api/defi/pools/:id
POST /api/defi/add-liquidity
POST /api/defi/remove-liquidity
POST /api/defi/swap
GET  /api/defi/positions
```

### Health Check

```http
GET /health
```

## 🔐 Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Application
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/agrotm
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Solana
SOLANA_NETWORK=devnet
SOLANA_DEVNET_RPC=https://api.devnet.solana.com

# Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE=your-railway-service-name
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Configure environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build for production
pnpm build
pnpm backend:build

# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway up
```

## 🧪 Testing

### Unit Tests

```bash
pnpm test                 # Run all tests
pnpm test:watch          # Run tests in watch mode
pnpm test:coverage       # Generate coverage report
```

### Integration Tests

```bash
pnpm test:integration    # Run integration tests
```

### End-to-End Tests

```bash
pnpm test:e2e            # Run E2E tests with Cypress
pnpm test:e2e:open       # Open Cypress UI
```

### Contract Tests

```bash
pnpm contracts:test      # Test Solana programs
```

## 📊 Monitoring

### Performance

- **Lighthouse CI** - Performance monitoring
- **Vercel Analytics** - Frontend analytics
- **Railway Metrics** - Backend monitoring

### Error Tracking

- **Sentry** - Error monitoring and performance tracking
- **Winston** - Structured logging

### Health Checks

- **Health Endpoint** - `/health`
- **Database Connection** - MongoDB and Redis
- **Web3 Connection** - Solana RPC

## 🔒 Security

### Implemented Security Measures

- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin resource sharing
- **Helmet.js** - Security headers
- **Input Sanitization** - XSS protection
- **JWT Authentication** - Secure token-based auth
- **HTTPS Only** - Secure communication
- **Content Security Policy** - XSS and injection protection

### Security Best Practices

- Regular dependency updates
- Security audits with `pnpm audit`
- Environment variable protection
- Input validation and sanitization
- Secure session management
- Database query protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.agrotm.com](https://docs.agrotm.com)
- **Discord**: [discord.gg/agrotm](https://discord.gg/agrotm)
- **Email**: support@agrotm.com
- **Issues**: [GitHub Issues](https://github.com/your-username/agrotm-solana/issues)

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- Vercel for hosting and deployment
- Railway for backend hosting
- Open source community for amazing tools and libraries

---

**Made with ❤️ by the AGROTM Team**

[Website](https://agrotm.com) • [Twitter](https://twitter.com/agrotm) • [Discord](https://discord.gg/agrotm) • [GitHub](https://github.com/your-username/agrotm-solana)
