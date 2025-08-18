module.exports = {
  // Frontend files
  'frontend/**/*.{js,jsx,ts,tsx}': [
    'cd frontend && npm run lint:fix',
    'cd frontend && npm run type-check',
    'cd frontend && prettier --write',
  ],
  
  // Backend files
  'backend/**/*.{js,ts}': [
    'cd backend && npm run lint:fix',
    'cd backend && prettier --write',
  ],
  
  // Configuration files
  '*.{json,yml,yaml,md}': [
    'prettier --write',
  ],
  
  // Package files
  'package.json': [
    'prettier --write',
  ],
  
  // Root files
  '*.{js,ts}': [
    'eslint --fix',
    'prettier --write',
  ],
}; 