# Contributing to AGROTM Solana

We love your input! We want to make contributing to AGROTM Solana as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html)
Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## We Use [Conventional Commits](https://www.conventionalcommits.org/)
We use conventional commits to maintain a clean and informative git history. Please follow the conventional commits specification when making commits.

### Commit Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Examples
```
feat: add staking functionality
fix: resolve wallet connection issue
docs: update README with new features
style: format code according to prettier
refactor: improve component structure
perf: optimize bundle size
test: add unit tests for utils
chore: update dependencies
```

## Any contributions you make will be under the Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issue tracker](https://github.com/your-username/agrotm-solana/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/your-username/agrotm-solana/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).

## Development Setup

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn
- Git

### Installation
1. Fork and clone the repository
```bash
git clone https://github.com/your-username/agrotm-solana.git
cd agrotm-solana
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server
```bash
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Linting and Formatting
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Check formatting
npm run format:check
```

### Building
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` type when possible
- Use interfaces for object shapes
- Use enums for constants

### React
- Use functional components with hooks
- Use TypeScript for props
- Follow React best practices
- Use proper naming conventions

### Styling
- Use Tailwind CSS for styling
- Follow mobile-first approach
- Use CSS custom properties for theming
- Ensure accessibility compliance

### File Structure
```
src/
├── components/     # Reusable components
├── hooks/         # Custom React hooks
├── pages/         # Next.js pages
├── styles/        # Global styles
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── constants/     # Application constants
```

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the CHANGELOG.md with a note describing your changes.
3. The PR will be merged once you have the sign-off of at least one other developer.

## Questions?

Feel free to open an issue for any questions you might have about contributing to AGROTM Solana. 