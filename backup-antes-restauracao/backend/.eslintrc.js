module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'caughtErrorsIgnorePattern': '^_'
    }],
    'no-undef': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'no-case-declarations': 'off',
    '@typescript-eslint/no-require-imports': 'warn',
    'no-useless-escape': 'warn'
  },
  globals: {
    'process': true,
    'Buffer': true,
    'require': true,
    'module': true,
    'express': true,
    'Resend': true,
    'logger': true,
    'User': true,
    'PasswordReset': true,
    'auth': true,
    'sanitizeInput': true,
    'validateEmail': true,
    'validatePassword': true,
    'validatePhone': true,
    'validateDocument': true,
    'verifyTurnstile': true,
    'notificationService': true,
    'emailService': true,
    'passwordAttemptLimiter': true
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};