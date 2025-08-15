module.exports = {
  extends: ['next/core-web-vitals'],
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true
  },
  globals: {
    process: 'readonly',
    module: 'readonly',
    require: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    Buffer: 'readonly',
    global: 'readonly',
    console: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    exports: 'readonly',
    define: 'readonly',
    AMD: 'readonly'
  },
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-var': 'off',
    'prefer-const': 'off',
    'no-global-assign': 'off'
  },
  overrides: [
    {
      files: ['next.config.js'],
      env: {
        node: true,
        commonjs: true
      },
      globals: {
        require: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        exports: 'readonly'
      }
    }
  ]
}
