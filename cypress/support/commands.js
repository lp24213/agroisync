// Custom Cypress commands for AgroIsync

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click()
  cy.get('[data-cy=logout]').click()
  cy.url().should('include', '/login')
})

Cypress.Commands.add('createOrder', (orderData) => {
  cy.get('[data-cy=new-order]').click()
  cy.get('[data-cy=order-form]').within(() => {
    cy.get('[data-cy=product-type]').select(orderData.product)
    cy.get('[data-cy=quantity]').type(orderData.quantity)
    cy.get('[data-cy=destination]').type(orderData.destination)
    cy.get('[data-cy=delivery-date]').type(orderData.deliveryDate)
    cy.get('[data-cy=notes]').type(orderData.notes || '')
    cy.get('[data-cy=submit-order]').click()
  })
})

Cypress.Commands.add('makePayment', (amount) => {
  cy.get('[data-cy=payment-button]').click()
  cy.get('[data-cy=payment-amount]').should('contain', amount)
  cy.get('[data-cy=confirm-payment]').click()
  
  // Handle Stripe test card
  cy.get('[data-cy=stripe-card]').within(() => {
    cy.get('[data-cy=card-number]').type('4242424242424242')
    cy.get('[data-cy=card-expiry]').type('12/25')
    cy.get('[data-cy=card-cvc]').type('123')
    cy.get('[data-cy=submit-payment]').click()
  })
})

Cypress.Commands.add('uploadDocument', (selector, filePath) => {
  cy.get(selector).selectFile(filePath)
  cy.get('[data-cy=upload-progress]').should('be.visible')
  cy.get('[data-cy=upload-success]').should('be.visible')
})

Cypress.Commands.add('sendMessage', (message) => {
  cy.get('[data-cy=message-input]').type(message)
  cy.get('[data-cy=send-message]').click()
  cy.get('[data-cy=message-sent]').should('be.visible')
})

Cypress.Commands.add('switchLanguage', (language) => {
  cy.get('[data-cy=language-selector]').click()
  cy.get(`[data-cy=lang-${language}]`).click()
  cy.get('[data-cy=language-changed]').should('be.visible')
})

Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-cy=theme-toggle]').click()
  cy.get('body').should('have.class', 'dark-theme')
})

Cypress.Commands.add('waitForSocketConnection', () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      if (win.socket && win.socket.connected) {
        resolve()
      } else {
        win.socket.on('connect', resolve)
      }
    })
  })
})

Cypress.Commands.add('enableLocation', () => {
  cy.get('[data-cy=enable-location]').click()
  cy.get('[data-cy=location-permission]').should('be.visible')
})

Cypress.Commands.add('enableNotifications', () => {
  cy.get('[data-cy=enable-notifications]').click()
  cy.get('[data-cy=notification-permission]').should('be.visible')
})

Cypress.Commands.add('installPWA', () => {
  cy.get('[data-cy=install-pwa]').click()
  cy.get('[data-cy=pwa-installed]').should('be.visible')
})

Cypress.Commands.add('goOffline', () => {
  cy.get('[data-cy=offline-mode]').click()
  cy.get('[data-cy=offline-indicator]').should('be.visible')
})

Cypress.Commands.add('goOnline', () => {
  cy.get('[data-cy=go-online]').click()
  cy.get('[data-cy=sync-indicator]').should('be.visible')
})

Cypress.Commands.add('enablePowerMode', () => {
  cy.get('[data-cy=power-mode-toggle]').click()
  cy.get('[data-cy=power-mode-active]').should('be.visible')
})

Cypress.Commands.add('exportData', (format) => {
  cy.get('[data-cy=export-data]').click()
  cy.get(`[data-cy=export-${format}]`).click()
  cy.get('[data-cy=export-success]').should('be.visible')
})

Cypress.Commands.add('bulkAction', (action) => {
  cy.get('[data-cy=select-all]').click()
  cy.get('[data-cy=bulk-actions]').click()
  cy.get(`[data-cy=bulk-${action}]`).click()
  cy.get('[data-cy=bulk-success]').should('be.visible')
})

Cypress.Commands.add('approveKYC', (kycId) => {
  cy.get(`[data-cy=kyc-${kycId}]`).click()
  cy.get('[data-cy=approve-kyc]').click()
  cy.get('[data-cy=kyc-approved]').should('be.visible')
})

Cypress.Commands.add('rejectKYC', (kycId, reason) => {
  cy.get(`[data-cy=kyc-${kycId}]`).click()
  cy.get('[data-cy=reject-kyc]').click()
  cy.get('[data-cy=rejection-reason]').type(reason)
  cy.get('[data-cy=confirm-rejection]').click()
  cy.get('[data-cy=kyc-rejected]').should('be.visible')
})

Cypress.Commands.add('startTracking', () => {
  cy.get('[data-cy=start-tracking]').click()
  cy.get('[data-cy=tracking-active]').should('be.visible')
})

Cypress.Commands.add('stopTracking', () => {
  cy.get('[data-cy=stop-tracking]').click()
  cy.get('[data-cy=tracking-stopped]').should('be.visible')
})

Cypress.Commands.add('updateLocation', () => {
  cy.get('[data-cy=location-update]').click()
  cy.get('[data-cy=location-updated]').should('be.visible')
})

Cypress.Commands.add('calculateRoute', (origin, destination) => {
  cy.get('[data-cy=calculate-route]').click()
  cy.get('[data-cy=route-calculated]').should('be.visible')
})

Cypress.Commands.add('sendVoiceMessage', () => {
  cy.get('[data-cy=voice-message]').click()
  cy.get('[data-cy=voice-recording]').should('be.visible')
  cy.get('[data-cy=stop-recording]').click()
  cy.get('[data-cy=voice-transcription]').should('be.visible')
})

Cypress.Commands.add('analyzeImage', (imagePath) => {
  cy.get('[data-cy=image-upload]').selectFile(imagePath)
  cy.get('[data-cy=analyze-image]').click()
  cy.get('[data-cy=image-analysis]').should('be.visible')
})

Cypress.Commands.add('generateNFT', () => {
  cy.get('[data-cy=generate-nft]').click()
  cy.get('[data-cy=nft-generating]').should('be.visible')
  cy.get('[data-cy=nft-generated]').should('be.visible')
})

Cypress.Commands.add('makeCryptoPayment', (crypto, amount) => {
  cy.get('[data-cy=crypto-payment]').click()
  cy.get('[data-cy=select-crypto]').select(crypto)
  cy.get('[data-cy=crypto-amount]').should('contain', amount)
  cy.get('[data-cy=confirm-crypto-payment]').click()
  cy.get('[data-cy=crypto-transaction]').should('be.visible')
})

Cypress.Commands.add('earnPoints', (action) => {
  cy.get(`[data-cy=${action}]`).click()
  cy.get('[data-cy=points-earned]').should('be.visible')
})

Cypress.Commands.add('earnBadge', (badgeName) => {
  cy.get('[data-cy=badge-earned]').should('be.visible')
  cy.get('[data-cy=badge-name]').should('contain', badgeName)
})

Cypress.Commands.add('checkLeaderboard', () => {
  cy.get('[data-cy=leaderboard]').click()
  cy.get('[data-cy=leaderboard-list]').should('be.visible')
})

Cypress.Commands.add('setAccessibility', (setting) => {
  cy.get('[data-cy=accessibility-settings]').click()
  cy.get(`[data-cy=${setting}]`).check()
  cy.get('body').should('have.class', setting.replace('-', '-'))
})

Cypress.Commands.add('testPerformance', (page) => {
  cy.visit(page, {
    onBeforeLoad: (win) => {
      win.performance.mark('page-start')
    }
  })
  
  cy.get('[data-cy=page-content]').should('be.visible')
  
  cy.window().then((win) => {
    win.performance.mark('page-end')
    win.performance.measure('page-load', 'page-start', 'page-end')
    
    const measure = win.performance.getEntriesByName('page-load')[0]
    expect(measure.duration).to.be.lessThan(2000)
  })
})

Cypress.Commands.add('testSecurity', (endpoint, payload) => {
  cy.request({
    method: 'POST',
    url: endpoint,
    body: payload,
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.be.oneOf([400, 401, 403, 429])
  })
})

Cypress.Commands.add('testAccessibility', () => {
  cy.get('[aria-label]').should('exist')
  cy.get('[role]').should('exist')
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt')
  })
})

Cypress.Commands.add('testMobile', () => {
  cy.viewport('iphone-x')
  cy.get('button').each(($button) => {
    cy.wrap($button).should('have.css', 'min-height', '44px')
    cy.wrap($button).should('have.css', 'min-width', '44px')
  })
})

Cypress.Commands.add('waitForAI', () => {
  cy.get('[data-cy=ai-processing]').should('be.visible')
  cy.get('[data-cy=ai-response]').should('be.visible')
})

Cypress.Commands.add('waitForBlockchain', () => {
  cy.get('[data-cy=blockchain-processing]').should('be.visible')
  cy.get('[data-cy=blockchain-confirmed]').should('be.visible')
})

Cypress.Commands.add('waitForEmail', () => {
  cy.get('[data-cy=email-sending]').should('be.visible')
  cy.get('[data-cy=email-sent]').should('be.visible')
})

Cypress.Commands.add('waitForAnalytics', () => {
  cy.get('[data-cy=analytics-tracking]').should('be.visible')
  cy.get('[data-cy=analytics-tracked]').should('be.visible')
})

Cypress.Commands.add('waitForKYC', () => {
  cy.get('[data-cy=kyc-processing]').should('be.visible')
  cy.get('[data-cy=kyc-processed]').should('be.visible')
})

Cypress.Commands.add('waitForMap', () => {
  cy.get('[data-cy=map-loading]').should('be.visible')
  cy.get('[data-cy=map-loaded]').should('be.visible')
})

Cypress.Commands.add('waitForPWA', () => {
  cy.get('[data-cy=pwa-installing]').should('be.visible')
  cy.get('[data-cy=pwa-installed]').should('be.visible')
})

Cypress.Commands.add('waitForGamification', () => {
  cy.get('[data-cy=points-calculating]').should('be.visible')
  cy.get('[data-cy=points-earned]').should('be.visible')
})

Cypress.Commands.add('waitForMonitoring', () => {
  cy.get('[data-cy=monitoring-checking]').should('be.visible')
  cy.get('[data-cy=monitoring-results]').should('be.visible')
})

Cypress.Commands.add('waitForLogging', () => {
  cy.get('[data-cy=logging-processing]').should('be.visible')
  cy.get('[data-cy=logging-complete]').should('be.visible')
})

Cypress.Commands.add('waitForIntegration', () => {
  cy.get('[data-cy=integration-processing]').should('be.visible')
  cy.get('[data-cy=integration-complete]').should('be.visible')
})