/**
 * Prettier Configuration for AGROTM Solana
 * Code formatting rules for consistent style
 */

module.exports = {
  // Basic formatting
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  
  // Line formatting
  printWidth: 80,
  endOfLine: 'lf',
  
  // JSX formatting
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  
  // Object formatting
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow function formatting
  arrowParens: 'avoid',
  
  // File specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
