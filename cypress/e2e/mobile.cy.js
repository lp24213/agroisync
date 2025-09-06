describe('Mobile Tests - AgroIsync', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should work on mobile devices', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Test mobile navigation
    cy.get('[data-cy=mobile-menu]').should('be.visible')
    cy.get('[data-cy=mobile-menu]').click()
    cy.get('[data-cy=mobile-nav]').should('be.visible')
    
    // Test mobile login
    cy.get('[data-cy=mobile-login]').click()
    cy.get('[data-cy=login-form]').should('be.visible')
    
    cy.get('[data-cy=email]').type('buyer@test.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=login-button]').click()
    
    cy.url().should('include', '/dashboard/buyer')
  })

  it('should handle touch gestures', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Test swipe gestures
    cy.get('[data-cy=order-list]').swipe('left')
    cy.get('[data-cy=swipe-actions]').should('be.visible')
    
    // Test pinch to zoom
    cy.get('[data-cy=interactive-map]').pinch('zoomIn')
    cy.get('[data-cy=map-zoom]').should('be.visible')
    
    // Test pull to refresh
    cy.get('[data-cy=order-list]').swipe('down')
    cy.get('[data-cy=refresh-indicator]').should('be.visible')
  })

  it('should handle mobile payments', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Create order
    cy.get('[data-cy=new-order]').click()
    cy.get('[data-cy=order-form]').within(() => {
      cy.get('[data-cy=product-type]').select('Soybeans')
      cy.get('[data-cy=quantity]').type('1000')
      cy.get('[data-cy=destination]').type('São Paulo')
      cy.get('[data-cy=submit-order]').click()
    })
    
    // Test mobile payment
    cy.get('[data-cy=payment-button]').click()
    cy.get('[data-cy=mobile-payment]').should('be.visible')
    
    // Test Apple Pay
    cy.get('[data-cy=apple-pay]').click()
    cy.get('[data-cy=apple-pay-sheet]').should('be.visible')
    
    // Test Google Pay
    cy.get('[data-cy=google-pay]').click()
    cy.get('[data-cy=google-pay-sheet]').should('be.visible')
  })

  it('should handle mobile camera integration', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/seller')
    cy.login('seller@test.com', 'password123')
    
    // Test camera for KYC
    cy.get('[data-cy=kyc-section]').click()
    cy.get('[data-cy=camera-upload]').click()
    cy.get('[data-cy=camera-modal]').should('be.visible')
    
    // Test document scanning
    cy.get('[data-cy=scan-document]').click()
    cy.get('[data-cy=camera-viewfinder]').should('be.visible')
    
    // Test photo capture
    cy.get('[data-cy=capture-photo]').click()
    cy.get('[data-cy=photo-preview]').should('be.visible')
  })

  it('should handle mobile notifications', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Test notification permission
    cy.get('[data-cy=enable-notifications]').click()
    cy.get('[data-cy=notification-permission]').should('be.visible')
    
    // Test push notifications
    cy.get('[data-cy=test-notification]').click()
    cy.get('[data-cy=notification-sent]').should('be.visible')
  })

  it('should handle mobile offline mode', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Simulate offline mode
    cy.get('[data-cy=offline-mode]').click()
    cy.get('[data-cy=offline-indicator]').should('be.visible')
    
    // Test offline functionality
    cy.get('[data-cy=offline-orders]').should('be.visible')
    cy.get('[data-cy=offline-data]').should('be.visible')
    
    // Test sync when online
    cy.get('[data-cy=go-online]').click()
    cy.get('[data-cy=sync-indicator]').should('be.visible')
  })

  it('should handle mobile voice input', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Test voice input
    cy.get('[data-cy=ai-chatbot]').click()
    cy.get('[data-cy=voice-input]').click()
    cy.get('[data-cy=voice-recording]').should('be.visible')
    
    // Test voice commands
    cy.get('[data-cy=voice-commands]').should('be.visible')
    cy.get('[data-cy=voice-command]').should('contain', 'Create order')
    cy.get('[data-cy=voice-command]').should('contain', 'Check status')
  })

  it('should handle mobile location services', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/driver')
    cy.login('driver@test.com', 'password123')
    
    // Test location permission
    cy.get('[data-cy=enable-location]').click()
    cy.get('[data-cy=location-permission]').should('be.visible')
    
    // Test location tracking
    cy.get('[data-cy=start-tracking]').click()
    cy.get('[data-cy=location-tracking]').should('be.visible')
    
    // Test location updates
    cy.get('[data-cy=location-update]').should('be.visible')
  })

  it('should handle mobile file uploads', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/seller')
    cy.login('seller@test.com', 'password123')
    
    // Test file upload
    cy.get('[data-cy=kyc-section]').click()
    cy.get('[data-cy=upload-document]').click()
    cy.get('[data-cy=file-picker]').should('be.visible')
    
    // Test camera upload
    cy.get('[data-cy=camera-upload]').click()
    cy.get('[data-cy=camera-modal]').should('be.visible')
    
    // Test gallery upload
    cy.get('[data-cy=gallery-upload]').click()
    cy.get('[data-cy=gallery-picker]').should('be.visible')
  })

  it('should handle mobile chat interface', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Test mobile chat
    cy.get('[data-cy=chat-button]').click()
    cy.get('[data-cy=mobile-chat]').should('be.visible')
    
    // Test chat input
    cy.get('[data-cy=chat-input]').type('Hello, mobile test')
    cy.get('[data-cy=send-message]').click()
    cy.get('[data-cy=message-sent]').should('be.visible')
    
    // Test voice message
    cy.get('[data-cy=voice-message]').click()
    cy.get('[data-cy=voice-recording]').should('be.visible')
  })

  it('should handle mobile map interface', () => {
    cy.viewport('iphone-x')
    cy.visit('/dashboard/buyer')
    cy.login('buyer@test.com', 'password123')
    
    // Test mobile map
    cy.get('[data-cy=track-order]').click()
    cy.get('[data-cy=mobile-map]').should('be.visible')
    
    // Test map gestures
    cy.get('[data-cy=mobile-map]').swipe('left')
    cy.get('[data-cy=mobile-map]').swipe('right')
    cy.get('[data-cy=mobile-map]').swipe('up')
    cy.get('[data-cy=mobile-map]').swipe('down')
    
    // Test map controls
    cy.get('[data-cy=map-controls]').should('be.visible')
    cy.get('[data-cy=zoom-in]').click()
    cy.get('[data-cy=zoom-out]').click()
  })

  it('should handle mobile PWA features', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Test PWA installation
    cy.get('[data-cy=install-pwa]').click()
    cy.get('[data-cy=pwa-install-prompt]').should('be.visible')
    
    // Test PWA features
    cy.get('[data-cy=pwa-features]').should('be.visible')
    cy.get('[data-cy=offline-support]').should('be.visible')
    cy.get('[data-cy=push-notifications]').should('be.visible')
    cy.get('[data-cy=home-screen]').should('be.visible')
  })

  it('should handle mobile performance', () => {
    cy.viewport('iphone-x')
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('mobile-start')
      }
    })
    
    cy.get('[data-cy=homepage-content]').should('be.visible')
    
    cy.window().then((win) => {
      win.performance.mark('mobile-end')
      win.performance.measure('mobile-load', 'mobile-start', 'mobile-end')
      
      const measure = win.performance.getEntriesByName('mobile-load')[0]
      expect(measure.duration).to.be.lessThan(3000) // 3 seconds max on mobile
    })
  })

  it('should handle mobile accessibility', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Test mobile accessibility
    cy.get('[data-cy=accessibility-settings]').click()
    cy.get('[data-cy=mobile-accessibility]').should('be.visible')
    
    // Test touch targets
    cy.get('button').each(($button) => {
      cy.wrap($button).should('have.css', 'min-height', '44px')
      cy.wrap($button).should('have.css', 'min-width', '44px')
    })
    
    // Test screen reader support
    cy.get('[data-cy=screen-reader]').check()
    cy.get('body').should('have.class', 'screen-reader-friendly')
  })

  it('should handle mobile error states', () => {
    cy.viewport('iphone-x')
    cy.visit('/login')
    
    // Test mobile error handling
    cy.get('[data-cy=email]').type('invalid-email')
    cy.get('[data-cy=password]').type('wrong-password')
    cy.get('[data-cy=login-button]').click()
    
    // Check mobile error display
    cy.get('[data-cy=mobile-error]').should('be.visible')
    cy.get('[data-cy=error-message]').should('be.visible')
    cy.get('[data-cy=retry-button]').should('be.visible')
  })

  it('should handle mobile data usage', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    
    // Test data usage settings
    cy.get('[data-cy=settings]').click()
    cy.get('[data-cy=data-usage]').click()
    cy.get('[data-cy=data-settings]').should('be.visible')
    
    // Test low data mode
    cy.get('[data-cy=low-data-mode]').check()
    cy.get('body').should('have.class', 'low-data-mode')
    
    // Test image optimization
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'loading', 'lazy')
    })
  })
})
