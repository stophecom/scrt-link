/// <reference types="cypress" />

import secrets from '../fixtures/secrets.json'

context('Secrets', function () {
  before(function () {
    cy.visit('/')
  })

  // Create secrets
  it('should write a secret message', function () {
    cy.get('#form-create-secret textarea[name="message"]').type(secrets.message)
    cy.get('#form-create-secret').submit()
  })

  it('should receive and visit the secret link', function () {
    cy.get('#result-secret-link')
      .invoke('text')
      .then((href) => {
        cy.visit(href)
      })
  })

  it('should retrieve and see the decrypted secret', function () {
    cy.get('#secret-decrypted').should('have.text', secrets.message)
  })

  it('should add a 🔥 emoji', function () {
    // Technically it should show the real emoji, not the encoded one. For some reason cypress encodes the pathname.
    cy.location('pathname').should('contain', encodeURIComponent('🔥'))
  })

  it('should not see decrypted secret anymore after reloading the page', function () {
    cy.reload()
    cy.get('#secret-decrypted').should('not.exist')
    cy.get('h1').should('contain.text', 'Error')
  })
})
