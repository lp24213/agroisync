# Contributing to DeFi Dashboard

Thank you for considering contributing to the DeFi Dashboard project! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include any relevant logs or screenshots
- Specify the browser and operating system you're using

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the Issues section
- Use the feature request template when creating a new issue
- Describe the enhancement in detail and why it would be valuable
- Include mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name` or `git checkout -b fix/your-bugfix-name`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality: `npm test`
5. Commit your changes with a descriptive commit message
6. Push your branch to your fork: `git push origin feature/your-feature-name`
7. Submit a pull request to the main repository

## Development Setup

1. Clone the repository: `git clone https://github.com/yourusername/defi-dashboard.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the required values
4. Run the development server: `npm run dev`
5. Visit `http://localhost:3000` to see the application

## Coding Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep pull requests focused on a single change
- Use descriptive variable names and add comments for complex logic
- Follow TypeScript best practices and ensure proper typing

## Testing

- Run tests before submitting a pull request: `npm test`
- Write unit tests for new features
- Ensure all tests pass before submitting

## Documentation

- Update the README.md file with any new features or changes
- Document any new components or functions with JSDoc comments
- Update the CHANGELOG.md file with your changes

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
