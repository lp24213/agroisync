#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface BuildCheckConfig {
  checkTypeScript: boolean;
  checkLinting: boolean;
  checkTests: boolean;
  checkSecurity: boolean;
  checkDependencies: boolean;
  checkBuild: boolean;
  failOnError: boolean;
}

class BuildChecker {
  private config: BuildCheckConfig;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(config: BuildCheckConfig) {
    this.config = config;
  }

  async run(): Promise<boolean> {
    console.log('🔍 AGROTM Build Check');
    console.log('=====================');

    try {
      if (this.config.checkDependencies) {
        await this.checkDependencies();
      }

      if (this.config.checkTypeScript) {
        await this.checkTypeScript();
      }

      if (this.config.checkLinting) {
        await this.checkLinting();
      }

      if (this.config.checkTests) {
        await this.checkTests();
      }

      if (this.config.checkSecurity) {
        await this.checkSecurity();
      }

      if (this.config.checkBuild) {
        await this.checkBuild();
      }

      this.printResults();

      if (this.errors.length > 0 && this.config.failOnError) {
        console.error('❌ Build check failed');
        process.exit(1);
      }

      console.log('✅ Build check completed successfully');
      return true;

    } catch (error) {
      console.error('❌ Build check failed:', error);
      if (this.config.failOnError) {
        process.exit(1);
      }
      return false;
    }
  }

  private async checkDependencies(): Promise<void> {
    console.log('📦 Checking dependencies...');

    try {
      // Check for outdated packages
      const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdatedPackages = JSON.parse(outdated);
      
      if (Object.keys(outdatedPackages).length > 0) {
        this.warnings.push('Outdated packages found. Consider updating dependencies.');
        console.log('⚠️  Outdated packages detected');
      }

      // Check for security vulnerabilities
      const audit = execSync('npm audit --json', { encoding: 'utf8' });
      const auditResult = JSON.parse(audit);
      
      if (auditResult.vulnerabilities && Object.keys(auditResult.vulnerabilities).length > 0) {
        this.errors.push('Security vulnerabilities found in dependencies');
        console.log('❌ Security vulnerabilities detected');
      }

      console.log('✅ Dependencies check completed');

    } catch (error) {
      this.errors.push('Failed to check dependencies');
      console.log('❌ Dependencies check failed');
    }
  }

  private async checkTypeScript(): Promise<void> {
    console.log('🔧 Checking TypeScript...');

    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      console.log('✅ TypeScript check completed');

    } catch (error) {
      this.errors.push('TypeScript compilation errors found');
      console.log('❌ TypeScript check failed');
    }
  }

  private async checkLinting(): Promise<void> {
    console.log('🧹 Checking linting...');

    try {
      execSync('npm run lint', { stdio: 'inherit' });
      console.log('✅ Linting check completed');

    } catch (error) {
      this.errors.push('Linting errors found');
      console.log('❌ Linting check failed');
    }
  }

  private async checkTests(): Promise<void> {
    console.log('🧪 Running tests...');

    try {
      execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
      console.log('✅ Tests completed');

    } catch (error) {
      this.errors.push('Tests failed');
      console.log('❌ Tests failed');
    }
  }

  private async checkSecurity(): Promise<void> {
    console.log('🔒 Checking security...');

    try {
      // Check for hardcoded secrets
      await this.checkForSecrets();

      // Check for vulnerable dependencies
      await this.checkVulnerableDependencies();

      // Check for unsafe code patterns
      await this.checkUnsafePatterns();

      console.log('✅ Security check completed');

    } catch (error) {
      this.errors.push('Security check failed');
      console.log('❌ Security check failed');
    }
  }

  private async checkBuild(): Promise<void> {
    console.log('🏗️  Checking build...');

    try {
      // Clean previous build
      if (fs.existsSync('.next')) {
        fs.rmSync('.next', { recursive: true, force: true });
      }

      // Run build
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Build check completed');

    } catch (error) {
      this.errors.push('Build failed');
      console.log('❌ Build failed');
    }
  }

  private async checkForSecrets(): Promise<void> {
    const secretPatterns = [
      /private_key\s*[:=]\s*["'][^"']+["']/gi,
      /secret\s*[:=]\s*["'][^"']+["']/gi,
      /password\s*[:=]\s*["'][^"']+["']/gi,
      /api_key\s*[:=]\s*["'][^"']+["']/gi,
      /access_token\s*[:=]\s*["'][^"']+["']/gi,
    ];

    const filesToCheck = [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.json',
      '**/*.env*',
    ];

    for (const pattern of secretPatterns) {
      try {
        const result = execSync(`grep -r "${pattern.source}" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.env*"`, { encoding: 'utf8' });
        if (result.trim()) {
          this.warnings.push('Potential hardcoded secrets found');
          console.log('⚠️  Potential secrets detected');
        }
      } catch (error) {
        // grep returns non-zero exit code when no matches found
      }
    }
  }

  private async checkVulnerableDependencies(): Promise<void> {
    try {
      const audit = execSync('npm audit --audit-level=moderate --json', { encoding: 'utf8' });
      const auditResult = JSON.parse(audit);
      
      if (auditResult.vulnerabilities && Object.keys(auditResult.vulnerabilities).length > 0) {
        this.errors.push('Vulnerable dependencies found');
        console.log('❌ Vulnerable dependencies detected');
      }
    } catch (error) {
      // npm audit returns non-zero exit code when vulnerabilities found
    }
  }

  private async checkUnsafePatterns(): Promise<void> {
    const unsafePatterns = [
      /eval\s*\(/gi,
      /innerHTML\s*=/gi,
      /outerHTML\s*=/gi,
      /document\.write/gi,
    ];

    for (const pattern of unsafePatterns) {
      try {
        const result = execSync(`grep -r "${pattern.source}" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"`, { encoding: 'utf8' });
        if (result.trim()) {
          this.warnings.push('Unsafe code patterns found');
          console.log('⚠️  Unsafe patterns detected');
        }
      } catch (error) {
        // grep returns non-zero exit code when no matches found
      }
    }
  }

  private printResults(): void {
    console.log('\n📊 Build Check Results');
    console.log('=====================');

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('\n🎉 No issues found!');
    }

    console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config: BuildCheckConfig = {
    checkTypeScript: !args.includes('--no-ts'),
    checkLinting: !args.includes('--no-lint'),
    checkTests: !args.includes('--no-test'),
    checkSecurity: !args.includes('--no-security'),
    checkDependencies: !args.includes('--no-deps'),
    checkBuild: !args.includes('--no-build'),
    failOnError: !args.includes('--no-fail'),
  };

  const checker = new BuildChecker(config);
  await checker.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { BuildChecker };
export type { BuildCheckConfig }; 