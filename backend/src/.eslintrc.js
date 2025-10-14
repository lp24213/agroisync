module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  globals: {
    process: true,
    Buffer: true,
    require: true,
    module: true,
    express: true,
    Resend: true,
    User: true,
    PasswordReset: true,
    emailService: true,
    notificationService: true,
    auth: true,
    sanitizeInput: true,
    validateEmail: true,
    validatePassword: true,
    validatePhone: true,
    validateDocument: true,
    verifyTurnstile: true,
    passwordAttemptLimiter: true,
    logger: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'no-undef': 'error',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-case-declarations': 'off',
    'no-useless-escape': 'off'
  }
};