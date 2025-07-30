# 🤝 Contributing to AGROTM

Thank you for your interest in contributing to AGROTM! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Security Issues](#security-issues)
- [Community Guidelines](#community-guidelines)

## 📜 Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- **Demonstrating empathy and kindness** toward other people
- **Being respectful** of differing opinions, viewpoints, and experiences
- **Giving and gracefully accepting** constructive feedback
- **Accepting responsibility** and apologizing to those affected by our mistakes
- **Focusing on what is best** for the overall community

Examples of unacceptable behavior include:

- **The use of sexualized language or imagery**, and sexual attention or advances
- **Trolling, insulting or derogatory comments**, and personal or political attacks
- **Public or private harassment**
- **Publishing others' private information**, such as physical or email addresses, without explicit permission
- **Other conduct which could reasonably be considered inappropriate** in a professional setting

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

### Scope

This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at conduct@agrotm.com. All complaints will be reviewed and investigated promptly and fairly.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Git** (latest version)
- **Docker** (optional, for containerized development)
- **Code Editor** (VS Code recommended)

### Quick Start

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/agrotm-solana.git
   cd agrotm-solana
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Setup Environment**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development**
   ```bash
   pnpm dev
   ```

## 🛠️ Development Setup

### Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Required for development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Database (choose one)
DATABASE_URL=postgresql://username:password@localhost:5432/agrotm_db
# or
MONGODB_URI=mongodb://localhost:27017/agrotm

# Blockchain (use testnets for development)
SOLANA_RPC_URL=https://api.devnet.solana.com
ETHEREUM_RPC_URL=https://eth-goerli.alchemyapi.io/v2/your-api-key

# External APIs (optional for development)
COINGECKO_API_KEY=your_api_key
FIREBASE_API_KEY=your_firebase_key
```

### Database Setup

#### PostgreSQL (Recommended)

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb agrotm_db
sudo -u postgres createuser agrotm_user
sudo -u postgres psql -c "ALTER USER agrotm_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agrotm_db TO agrotm_user;"

# Run migrations
pnpm db:migrate
pnpm db:seed
```

#### MongoDB (Alternative)

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database
mongo
use agrotm
db.createUser({user: "agrotm_user", pwd: "your_password", roles: ["readWrite"]})
```

### Blockchain Setup

#### Solana Development

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Install Anchor Framework
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Build contracts
cd contracts
anchor build
```

#### Ethereum Development

```bash
# Install Hardhat
npm install -g hardhat

# Compile contracts
cd contracts/ethereum
npx hardhat compile
```

## 📝 Coding Standards

### TypeScript Guidelines

- **Use strict mode**: Always enable `strict: true` in `tsconfig.json`
- **Prefer interfaces over types**: Use interfaces for object shapes
- **Use enums sparingly**: Prefer union types for simple cases
- **Avoid `any`**: Use `unknown` or proper types instead
- **Use generics**: When creating reusable components/functions

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  walletAddress?: string;
}

type Network = 'solana' | 'ethereum';

function processUser<T extends User>(user: T): T {
  return user;
}

// ❌ Bad
const user: any = { id: 1, email: 'test@example.com' };
```

### React Guidelines

- **Use functional components**: Prefer hooks over class components
- **Custom hooks**: Extract reusable logic into custom hooks
- **Proper prop types**: Use TypeScript interfaces for props
- **Error boundaries**: Wrap components that might fail
- **Performance**: Use `React.memo`, `useMemo`, `useCallback` appropriately

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <button className={`btn btn-${variant}`} onClick={handleClick}>
      {children}
    </button>
  );
};

// ❌ Bad
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### CSS/Styling Guidelines

- **Use Tailwind CSS**: Prefer utility classes over custom CSS
- **CSS Modules**: For component-specific styles
- **Responsive design**: Mobile-first approach
- **Accessibility**: Ensure proper contrast and focus states

```css
/* ✅ Good - Tailwind utilities */
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

/* ✅ Good - CSS Modules */
.button {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
}

/* ❌ Bad - Inline styles */
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWallet.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Import/Export Guidelines

```typescript
// ✅ Good - Named exports
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// ✅ Good - Default export for components
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

export default UserProfile;

// ✅ Good - Barrel exports
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';

// ❌ Bad - Mixed default/named exports
export default { formatCurrency, UserProfile };
```

## 📝 Commit Guidelines

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat: add wallet connection functionality"

# Bug fix
git commit -m "fix: resolve staking calculation error"

# Documentation
git commit -m "docs: update API documentation"

# Breaking change
git commit -m "feat!: remove deprecated API endpoints

BREAKING CHANGE: The /api/v1/old-endpoint has been removed.
Use /api/v2/new-endpoint instead."

# With scope
git commit -m "feat(ui): add dark mode toggle component"
git commit -m "fix(api): handle null wallet address in staking endpoint"
```

### Commit Message Rules

1. **Use present tense**: "add" not "added"
2. **Use imperative mood**: "move cursor to..." not "moves cursor to..."
3. **Don't capitalize first letter**: "add" not "Add"
4. **No dot at the end**: "add feature" not "add feature."
5. **Keep it under 72 characters**: Use body for longer descriptions

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

2. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update API documentation

3. **Check for conflicts**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context.
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer must approve
3. **Testing**: Changes must pass all tests
4. **Documentation**: Documentation must be updated
5. **Merge**: PR is merged after approval

## 🧪 Testing Guidelines

### Test Structure

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
├── contracts/        # Smart contract tests
└── fixtures/         # Test data and mocks
```

### Writing Tests

#### Unit Tests

```typescript
// ✅ Good
describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero amount', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-100)).toBe('-$100.00');
  });
});

// ❌ Bad
test('formatCurrency works', () => {
  expect(formatCurrency(100)).toBe('$100.00');
});
```

#### Component Tests

```typescript
// ✅ Good
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from '../WalletConnect';

describe('WalletConnect', () => {
  it('should render connect button', () => {
    render(<WalletConnect />);
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('should handle wallet connection', async () => {
    const mockConnect = jest.fn();
    render(<WalletConnect onConnect={mockConnect} />);
    
    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));
    
    expect(mockConnect).toHaveBeenCalled();
  });
});
```

#### API Tests

```typescript
// ✅ Good
import request from 'supertest';
import { app } from '../src/app';

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should authenticate valid user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
```

### Test Coverage

- **Minimum coverage**: 80% for new code
- **Critical paths**: 100% coverage required
- **Edge cases**: Test boundary conditions
- **Error handling**: Test error scenarios

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit
pnpm test:integration
pnpm test:e2e

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests in parallel
pnpm test:parallel
```

## 📚 Documentation

### Code Documentation

#### JSDoc Comments

```typescript
/**
 * Formats a currency amount with proper locale and currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(100, 'EUR', 'de-DE') // Returns "100,00 €"
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};
```

#### Component Documentation

```typescript
/**
 * WalletConnect component for connecting cryptocurrency wallets
 * 
 * Supports multiple wallet providers including MetaMask, WalletConnect,
 * and Solana wallets.
 * 
 * @example
 * ```tsx
 * <WalletConnect
 *   onConnect={(wallet) => console.log('Connected:', wallet)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
interface WalletConnectProps {
  /** Callback when wallet is successfully connected */
  onConnect: (wallet: Wallet) => void;
  /** Callback when connection fails */
  onError: (error: Error) => void;
  /** Whether to show connection status */
  showStatus?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onError,
  showStatus = true
}) => {
  // Component implementation
};
```

### API Documentation

Use OpenAPI/Swagger for API documentation:

```yaml
openapi: 3.0.0
info:
  title: AGROTM API
  version: 2.0.0
  description: API for AGROTM DeFi platform

paths:
  /api/auth/login:
    post:
      summary: Authenticate user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
```

## 🐛 Bug Reports

### Before Reporting

1. **Check existing issues**: Search GitHub issues for similar problems
2. **Reproduce the bug**: Ensure you can consistently reproduce the issue
3. **Check documentation**: Verify the behavior isn't documented as expected
4. **Test in different environments**: Try different browsers, devices, etc.

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 20.0.0]
- AGROTM Version: [e.g. 2.0.0]

## Additional Context
- Screenshots
- Console logs
- Network tab information
- Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing features**: Ensure the feature doesn't already exist
2. **Search discussions**: Look for similar requests in GitHub discussions
3. **Consider alternatives**: Think about workarounds or existing solutions
4. **Validate need**: Ensure the feature benefits the broader community

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternative Solutions
Any alternative solutions you've considered.

## Additional Context
- Use cases
- Mockups/wireframes
- Related features
- Impact on existing functionality
```

## 🔒 Security Issues

### Reporting Security Issues

**DO NOT** create a public GitHub issue for security vulnerabilities. Instead:

1. **Email**: security@agrotm.com
2. **PGP Key**: [Security PGP Key](https://agrotm.com/security.asc)
3. **Responsible disclosure**: Allow time for fixes before public disclosure

### Security Issue Template

```markdown
## Vulnerability Type
- [ ] SQL Injection
- [ ] XSS
- [ ] CSRF
- [ ] Authentication Bypass
- [ ] Authorization Bypass
- [ ] Information Disclosure
- [ ] Denial of Service
- [ ] Other

## Description
Detailed description of the vulnerability.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Impact
What is the potential impact of this vulnerability?

## Suggested Fix
Any suggestions for fixing the issue.

## Timeline
When do you plan to disclose this publicly?
```

## 👥 Community Guidelines

### Communication

- **Be respectful**: Treat others with kindness and respect
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Maintainers and contributors are volunteers
- **Be inclusive**: Welcome newcomers and diverse perspectives

### Getting Help

- **Read documentation**: Check docs before asking questions
- **Search issues**: Look for similar questions in GitHub issues
- **Provide context**: Include relevant code, error messages, and environment details
- **Be specific**: Ask specific questions rather than general ones

### Recognition

Contributors are recognized in several ways:

- **Contributors list**: Added to README.md contributors section
- **Release notes**: Mentioned in release changelogs
- **Hall of Fame**: Featured on the AGROTM website
- **Swag**: Receive AGROTM merchandise for significant contributions

### Mentorship

- **New contributors**: Experienced contributors mentor newcomers
- **Code reviews**: Detailed feedback on pull requests
- **Documentation**: Help improve documentation and guides
- **Community events**: Participate in hackathons and meetups

## 📞 Contact

- **General questions**: support@agrotm.com
- **Security issues**: security@agrotm.com
- **Contributions**: contribute@agrotm.com
- **Discord**: [discord.gg/agrotm](https://discord.gg/agrotm)
- **Telegram**: [t.me/agrotm](https://t.me/agrotm)

---

**Thank you for contributing to AGROTM! 🌱**

Your contributions help make AGROTM the world's most advanced agricultural DeFi platform. 