# AGROTM Solana DeFi Backend

🚀 **Enterprise-grade, secure, and scalable Web3 backend for AGROTM DeFi platform**

## 🏗️ Architecture Overview

This backend is built with a **Clean Architecture** approach, following **SOLID principles** and industry best practices for Web3 applications.

### 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Controllers │  │   Middleware        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Business Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Services  │  │   Models    │  │   Validators        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Database  │  │    Redis    │  │   Web3 Providers    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🛡️ Security Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (RBAC) with granular permissions
- **Account lockout protection** after failed login attempts
- **Session management** with Redis for scalability
- **Two-factor authentication** support (2FA)

### 🛡️ API Security
- **Rate limiting** with configurable thresholds per endpoint
- **DDoS protection** with suspicious activity detection
- **Input validation & sanitization** using Joi schemas
- **CORS protection** with whitelisted origins
- **Security headers** (Helmet.js)
- **SQL injection prevention** with parameterized queries
- **XSS protection** with content sanitization

### 🔒 Web3 Security
- **Wallet address validation** for Solana addresses
- **Transaction signature verification**
- **Smart contract interaction security**
- **Private key management** (never stored on server)
- **Gas optimization** and transaction monitoring

## 🚀 Performance Features

### ⚡ Optimization
- **Database indexing** for optimal query performance
- **Redis caching** for frequently accessed data
- **Connection pooling** for database efficiency
- **Compression middleware** for response optimization
- **Load balancing** ready architecture

### 📊 Monitoring & Logging
- **Structured logging** with Winston
- **Performance monitoring** with request timing
- **Error tracking** with detailed stack traces
- **Audit logging** for security events
- **Health check endpoints** for monitoring

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # MongoDB & Redis config
│   │   ├── security.ts   # Security middleware config
│   │   └── web3.ts       # Solana Web3 config
│   ├── controllers/      # Request handlers
│   │   └── authController.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── validation.ts # Input validation
│   │   └── audit.ts      # Audit logging
│   ├── models/           # Database models
│   │   ├── User.ts
│   │   ├── StakingPool.ts
│   │   └── StakingRecord.ts
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── staking.ts
│   │   └── defi.ts
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   └── stakingService.ts
│   ├── docs/             # API documentation
│   │   └── swagger.ts
│   └── __tests__/        # Test files
│       └── auth.test.ts
├── .github/workflows/    # CI/CD pipelines
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5.0+
- Redis 6.0+
- Solana CLI (for development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/agrotm/agrotm-solana.git
cd agrotm-solana/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/agrotm
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

5. **Start development server**
```bash
npm run dev
```

## 🧪 Testing

### Run all tests
```bash
npm test
```

### Run specific test suites
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Load tests
npm run test:load
```

### Test coverage
```bash
npm run test:coverage
```

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:3001/api-docs`
- **OpenAPI Spec**: `http://localhost:3001/api-docs.json`

### Key Endpoints

#### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile
POST /api/auth/change-password  # Change password
POST /api/auth/refresh-token     # Refresh JWT token
POST /api/auth/logout       # User logout
POST /api/auth/verify-token # Verify token validity
```

#### Staking
```
GET  /api/staking/pools     # Get all staking pools
GET  /api/staking/pools/:id # Get specific pool
POST /api/staking/stake     # Stake tokens
POST /api/staking/unstake   # Unstake tokens
POST /api/staking/claim-rewards  # Claim rewards
GET  /api/staking/user/:walletAddress  # Get user staking info
GET  /api/staking/stats     # Get staking statistics
```

#### DeFi
```
GET  /api/defi/pools        # Get liquidity pools
GET  /api/defi/farms        # Get yield farms
POST /api/defi/add-liquidity    # Add liquidity
POST /api/defi/remove-liquidity # Remove liquidity
POST /api/defi/stake-farm   # Stake in yield farm
POST /api/defi/unstake-farm # Unstake from farm
GET  /api/defi/stats        # Get DeFi statistics
```

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Deployment

### Production Deployment
```bash
# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t agrotm-backend .

# Run container
docker run -p 3001:3001 agrotm-backend
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://your-mongodb-uri
REDIS_URL=redis://your-redis-uri
JWT_SECRET=your-production-jwt-secret
SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=https://app.agrotm.com
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "web3": "connected"
  }
}
```

### Metrics Endpoints
```
GET /metrics          # Prometheus metrics
GET /api/stats/overview  # Application statistics
```

## 🔒 Security Checklist

- [x] JWT authentication with secure tokens
- [x] Rate limiting on all endpoints
- [x] Input validation and sanitization
- [x] CORS protection
- [x] Security headers (Helmet.js)
- [x] DDoS protection
- [x] SQL injection prevention
- [x] XSS protection
- [x] Account lockout protection
- [x] Audit logging
- [x] Wallet address validation
- [x] Transaction signature verification
- [x] Environment variable security
- [x] HTTPS enforcement
- [x] Regular security updates

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
- Ensure all tests pass
- Update security measures if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.agrotm.com](https://docs.agrotm.com)
- **Issues**: [GitHub Issues](https://github.com/agrotm/agrotm-solana/issues)
- **Discord**: [AGROTM Community](https://discord.gg/agrotm)
- **Email**: support@agrotm.com

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

**Built with ❤️ by the AGROTM Team** 