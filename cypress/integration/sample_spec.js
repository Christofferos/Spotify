/* describe('Example Cypress Test', () => {
  it('clicking "type" navigates to a new url', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    cy.url().should('include', '/commands/actions')
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
}) */

const username = 'mucke1'
const password = '...'
const csrfToken =
  '260b866215e11fc69613ee9ab15a0bf7451391ffab5869712c8bbce260f97d72|8119eb27da7a852dfb7cc8e9a9d8417416ab79c417079078528f7121cafbc5a9'

describe('Login Screen Test', () => {
  Cypress.Commands.add('loginByCSRF', (csrfToken) => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false, // dont fail so we can make assertions
      form: true, // we are submitting a regular form body
      body: {
        username,
        password,
        _csrf: csrfToken, // insert this as part of form body
      },
    })
  })

  before(() => {
    cy.visit('http://localhost:3000')
    cy.contains('Login').click()
    cy.get('#login-username').type(username)
    cy.get('#login-password').type(password)
    cy.get('#login-button').click()
  })
  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      'next-auth.callback-url',
      'next-auth.csrf-token',
      'next-auth.session-token'
    )
  })
  it('checking that "Login" button is visible', () => {
    //
  })
})
