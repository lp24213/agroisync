# AGROISYNC - Dependency Management Guide

## Overview

This guide helps you manage dependencies and resolve npm deprecation warnings in the AGROISYNC project.

## Current Deprecation Warnings

The following packages are currently showing deprecation warnings:

### Babel Plugins (Frontend)
- `@babel/plugin-proposal-private-methods` → `@babel/plugin-transform-private-methods`
- `@babel/plugin-proposal-numeric-separator` → `@babel/plugin-transform-numeric-separator`
- `@babel/plugin-proposal-optional-chaining` → `@babel/plugin-transform-optional-chaining`
- `@babel/plugin-proposal-nullish-coalescing-operator` → `@babel/plugin-transform-nullish-coalescing-operator`
- `@babel/plugin-proposal-private-property-in-object` → `@babel/plugin-transform-private-property-in-object`

### ESLint Packages
- `@humanwhocodes/object-schema` → `@eslint/object-schema`
- `@humanwhocodes/config-array` → `@eslint/config-array`
- `eslint@8.57.1` → Latest version

### Other Deprecated Packages
- `sourcemap-codec@1.4.8` → `@jridgewell/sourcemap-codec`
- `svgo@1.3.2` → `svgo@latest`
- `workbox-google-analytics@6.6.0` → Remove (not compatible with GA4)
- `q@1.5.1` → Use native JavaScript Promises
- `w3c-hr-time@1.0.2` → Use native `performance.now()`
- `domexception@2.0.1` → Use native `DOMException`
- `abab@2.0.6` → Use native `atob()` and `btoa()`

## Quick Fix Scripts

### For Linux/Mac Users
```bash
chmod +x scripts/update-dependencies.sh
./scripts/update-dependencies.sh
```

### For Windows Users
```powershell
.\scripts\update-dependencies.ps1
```

## Manual Update Process

### 1. Frontend Dependencies

```bash
cd frontend

# Update Babel plugins
npm install --save-dev @babel/plugin-transform-private-methods@latest
npm install --save-dev @babel/plugin-transform-numeric-separator@latest
npm install --save-dev @babel/plugin-transform-optional-chaining@latest
npm install --save-dev @babel/plugin-transform-nullish-coalescing-operator@latest
npm install --save-dev @babel/plugin-transform-private-property-in-object@latest

# Update ESLint packages
npm install --save-dev @eslint/object-schema@latest
npm install --save-dev @eslint/config-array@latest

# Update other packages
npm install --save-dev @jridgewell/sourcemap-codec@latest
npm install --save-dev svgo@latest

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### 2. Backend Dependencies

```bash
cd backend

# Update ESLint
npm install --save-dev eslint@latest

# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Configuration Files

### .npmrc
The project includes an `.npmrc` file that:
- Suppresses deprecation warnings during builds
- Disables funding and audit messages
- Uses legacy peer deps to avoid conflicts
- Optimizes npm performance

### GitHub Actions
The workflow has been updated to:
- Suppress deprecation warnings during CI/CD builds
- Add dependency update checks
- Use `--no-audit --no-fund` flags for faster installs

## Best Practices

### 1. Regular Updates
- Run dependency updates monthly
- Use `npm outdated` to check for updates
- Test thoroughly after major updates

### 2. Security
- Run `npm audit` regularly
- Fix high and critical vulnerabilities first
- Use `npm audit fix` when safe

### 3. Version Management
- Use `^` for minor updates (recommended)
- Use `~` for patch updates (more conservative)
- Use exact versions for critical dependencies

### 4. Testing
- Always test after dependency updates
- Run your test suite
- Test in staging environment before production

## Troubleshooting

### Common Issues

#### 1. Peer Dependency Conflicts
```bash
npm install --legacy-peer-deps
```

#### 2. Lock File Conflicts
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build Failures After Updates
- Check for breaking changes in major version updates
- Review changelogs for updated packages
- Rollback to previous working versions if needed

#### 4. Performance Issues
- Use `npm ci` instead of `npm install` in CI/CD
- Consider using `pnpm` or `yarn` for better performance
- Enable npm cache in CI/CD

## Monitoring

### 1. CI/CD Integration
- Dependency updates are checked in GitHub Actions
- Security scans run automatically
- Build logs show deprecation warnings

### 2. Local Development
- Use `npm outdated` to check for updates
- Monitor build output for warnings
- Keep Node.js and npm versions updated

## Future Improvements

### 1. Automated Updates
- Consider using Dependabot or Renovate
- Set up automated security scanning
- Implement automated testing after updates

### 2. Modernization
- Migrate to newer build tools (Vite, esbuild)
- Update to latest Node.js LTS version
- Consider using TypeScript for better type safety

### 3. Performance
- Implement dependency caching
- Use workspace packages for monorepo
- Optimize bundle sizes

## Support

If you encounter issues with dependency management:

1. Check this documentation first
2. Review the troubleshooting section
3. Check package changelogs
4. Create an issue in the project repository
5. Contact the development team

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Node.js LTS Schedule](https://nodejs.org/en/about/releases/)
- [Babel Documentation](https://babeljs.io/docs/)
- [ESLint Documentation](https://eslint.org/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
