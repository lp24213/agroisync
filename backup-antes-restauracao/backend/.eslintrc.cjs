module.exports = {module.exports = {

    "env": {  env: {

        "node": true,    node: true,

        "es2021": true    es2022: true,

    },    jest: true

    "extends": "eslint:recommended",  },

    "parserOptions": {  extends: ['eslint:recommended', 'prettier'],

        "ecmaVersion": "latest",  plugins: ['prettier'],

        "sourceType": "module"  parserOptions: {

    },    ecmaVersion: 2022,

    "rules": {    sourceType: 'module'

        "no-unused-vars": ["warn", {  },

            "argsIgnorePattern": "^_",  rules: {

            "varsIgnorePattern": "^_"    // Prettier integration (desativado para não bloquear caso plugin não esteja presente)

        }],    'prettier/prettier': 'off',

        "no-console": "off"

    }    // General rules

}    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',

    // Code style
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],

    // Best practices
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    radix: 'error',
    yoda: 'error',

    // ES6+ features
    'arrow-spacing': 'error',
    'generator-star-spacing': ['error', 'before'],
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true
      }
    ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'rest-spread-spacing': 'error',
    'template-curly-spacing': 'error',

    // Node.js specific
    'callback-return': 'error',
    'handle-callback-err': 'error',
    'no-buffer-constructor': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',
    'no-process-exit': 'error'
  },
  overrides: [
    {
      // Test files
      files: ['**/*.test.js', '**/*.spec.js', '**/tests/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off'
      }
    },
    {
      // Configuration files
      files: ['*.config.js', '*.config.mjs'],
      env: {
        node: true
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'uploads/',
    'logs/',
    'temp/'
  ]
};
