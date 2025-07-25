describe('Landing Page', () => {
  it('should display AGROTM hero', () => {
    cy.visit('/');
    cy.contains('AGROTM').should('be.visible');
  });
});
