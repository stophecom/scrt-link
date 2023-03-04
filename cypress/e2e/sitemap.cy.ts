/// <reference types="cypress" />

describe('Sitemap', function () {
  let urls: string[] = []

  before(function () {
    if (Cypress.config('baseUrl') === 'http://localhost:3000') {
      this.skip()
    }
    cy.request('/sitemap.xml')
      .as('sitemap')
      .then((response) => {
        urls = Cypress.$(response.body)
          .find('loc')
          .toArray()
          .map((el) => el.innerText)
      })
  })

  it('should successfully load each url in the sitemap', () => {
    urls.forEach((url) => {
      cy.request(url).then((resp) => {
        expect(resp.status).to.eq(200)
      })
    })
  })
})

export {}
