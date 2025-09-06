const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/commands.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    env: {
      apiUrl: 'http://localhost:3000/api',
      testUser: {
        email: 'test@test.com',
        password: 'password123'
      },
      stripe: {
        publishableKey: 'pk_test_1234567890',
        secretKey: 'sk_test_1234567890'
      },
      mongodb: {
        uri: 'mongodb://localhost:27017/agroisync-test'
      },
      redis: {
        url: 'redis://localhost:6379'
      },
      openai: {
        apiKey: 'sk-test1234567890'
      },
      blockchain: {
        ethereum: {
          rpcUrl: 'https://mainnet.infura.io/v3/test',
          privateKey: '0x1234567890abcdef'
        },
        solana: {
          rpcUrl: 'https://api.mainnet-beta.solana.com',
          privateKey: '1234567890abcdef'
        }
      }
    },
    setupNodeEvents(on, config) {
      // Handle file downloads
      on('task', {
        downloadFile: (filePath) => {
          return filePath
        }
      })
      
      // Custom tasks for testing
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        
        // Database tasks
        seedDatabase() {
          // Seed test database
          return null
        },
        
        clearDatabase() {
          // Clear test database
          return null
        },
        
        // Blockchain tasks
        createTestWallet() {
          // Create test wallet
          return null
        },
        
        // AI tasks
        mockAIResponse(response) {
          // Mock AI response
          return response
        },
        
        // Performance tasks
        measurePerformance(metric) {
          // Measure performance metric
          return metric
        },
        
        // Security tasks
        testSecurity(payload) {
          // Test security payload
          return payload
        }
      })
      
      // Handle browser events
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-web-security')
          launchOptions.args.push('--disable-features=VizDisplayCompositor')
        }
        return launchOptions
      })
    }
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})