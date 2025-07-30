module.exports = {
  projects: [
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/frontend/**/*.test.{js,jsx,ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.js'],
      testEnvironment: 'jsdom',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/frontend/$1',
      },
    },
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/backend/**/*.test.ts'],
      testEnvironment: 'node',
      preset: 'ts-jest',
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/backend/src/$1',
      },
    },
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/dist/**',
    '!**/build/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}; 