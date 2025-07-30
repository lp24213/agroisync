module.exports = {
  // Lint and format TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'git add',
  ],
  
  // Format JSON files
  '*.json': [
    'prettier --write',
    'git add',
  ],
  
  // Format Markdown files
  '*.md': [
    'prettier --write',
    'git add',
  ],
  
  // Format CSS/SCSS files
  '*.{css,scss,sass}': [
    'prettier --write',
    'git add',
  ],
  
  // Format YAML files
  '*.{yml,yaml}': [
    'prettier --write',
    'git add',
  ],
  
  // Format HTML files
  '*.html': [
    'prettier --write',
    'git add',
  ],
  
  // Run type checking for TypeScript files
  '*.{ts,tsx}': () => 'pnpm type-check',
  
  // Run tests for changed files
  '*.{js,jsx,ts,tsx}': (filenames) => {
    const files = filenames.join(' ');
    return `pnpm test --findRelatedTests ${files} --passWithNoTests`;
  },
}; 