/// <reference types="cypress" />

context('Redirects', function () {
  it('should redirect to scrt.link', function () {
    cy.visit('/file')
    cy.location('pathname').should('contain', 'files')
  })

  it('redirects to scrt.link from 🤫.st', function () {
    cy.visit('https://🤫.st/')
    cy.url().should('contain', 'scrt.link')
  })

  it('redirects secrets from 🤫 domain', function () {
    cy.visit('https://🤫.st/en#some-secret')
    cy.url().should('contain', 'scrt.link')
    cy.location('pathname').should('contain', 'en/l#some-secret')
  })
})
