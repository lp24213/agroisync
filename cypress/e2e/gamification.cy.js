describe('Gamification System', () => {
  beforeEach(() => {
    cy.login('buyer@test.com', 'password123')
    cy.visit('/dashboard/buyer')
  })

  it('should display user ranking and badges', () => {
    // Check ranking display
    cy.get('[data-cy=user-ranking]').should('be.visible')
    cy.get('[data-cy=ranking-position]').should('contain', '#')
    
    // Check badges earned
    cy.get('[data-cy=badges-section]').should('be.visible')
    cy.get('[data-cy=badge-item]').should('have.length.greaterThan', 0)
    
    // Check points and level
    cy.get('[data-cy=user-points]').should('be.visible')
    cy.get('[data-cy=user-level]').should('be.visible')
  })

  it('should earn points for completing transactions', () => {
    const initialPoints = cy.get('[data-cy=user-points]').invoke('text')
    
    // Complete a transaction
    cy.get('[data-cy=new-order]').click()
    cy.get('[data-cy=order-form]').within(() => {
      cy.get('[data-cy=product-type]').select('Soybeans')
      cy.get('[data-cy=quantity]').type('1000')
      cy.get('[data-cy=destination]').type('São Paulo')
      cy.get('[data-cy=submit-order]').click()
    })
    
    // Verify points increase
    cy.get('[data-cy=user-points]').should(($points) => {
      expect($points.text()).to.not.equal(initialPoints)
    })
    
    // Check for new badge
    cy.get('[data-cy=badge-earned]').should('be.visible')
  })

  it('should display leaderboard', () => {
    cy.get('[data-cy=leaderboard]').click()
    
    // Check leaderboard content
    cy.get('[data-cy=leaderboard-list]').should('be.visible')
    cy.get('[data-cy=leaderboard-item]').should('have.length.greaterThan', 0)
    
    // Check ranking positions
    cy.get('[data-cy=leaderboard-item]').first().should('contain', '#1')
  })

  it('should show achievement notifications', () => {
    // Trigger achievement
    cy.get('[data-cy=complete-profile]').click()
    
    // Check achievement notification
    cy.get('[data-cy=achievement-notification]').should('be.visible')
    cy.get('[data-cy=achievement-title]').should('contain', 'Profile Complete')
    cy.get('[data-cy=achievement-points]').should('be.visible')
  })
})
