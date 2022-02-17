/// <reference types="cypress" />

context('Home', function () {
  before(function () {
    cy.visit('/?utm_source=e2e-test')
  })

  it('Should have charset UTF-8', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('Should render exactly one H1 title', function () {
    cy.get('H1').should('have.length', 1).should('have.text', 'Share a secret')
  })
})
