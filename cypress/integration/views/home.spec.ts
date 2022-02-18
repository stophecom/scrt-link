/// <reference types="cypress" />

// @ts-ignore
import { i18n } from '/next-i18next.config.js'

const localesCount = i18n?.locales?.length

context('Basics', function () {
  before(function () {
    cy.visit('/?utm_source=e2e-test') // Plausible should be blocked. Adding utm param just to be sure.
  })

  it('should have charset UTF-8', () => {
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('should render exactly one H1 title', function () {
    cy.get('H1').should('have.length', 1).should('have.text', 'Share a secret')
  })

  // SEO/Meta
  it('should have one title tag', function () {
    cy.get('head title')
      .should('have.length', 1)
      .should('have.text', 'Share a secret | 🤫 scrt.link')
  })

  it('should have meta description', function () {
    cy.get('meta[name="description"]').should('have.length', 1)
  })

  it('should have alternate language links for each supported language', function () {
    cy.get('link[rel="alternate"]').should('have.length', localesCount + 1)
  })

  it('should have one footer tag with legal links', function () {
    cy.get('footer')
      .should('have.length', 1)
      .and('contain', 'Imprint')
      .and('contain', 'Privacy Policy')
      .and('contain', 'Cookie Policy')
  })
})

context('German', function () {
  before(function () {
    cy.visit('/de')
  })

  it('should render exactly one H1 title in German', function () {
    cy.get('H1').should('have.length', 1).should('have.text', 'Teile ein Geheimnis')
  })

  it('should have one title tag in German', function () {
    cy.get('head title')
      .should('have.length', 1)
      .should('have.text', 'Teile ein Geheimnis | 🤫 scrt.link')
  })
})
