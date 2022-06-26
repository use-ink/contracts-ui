// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
const timeout = 25000;

Cypress.Commands.add('instantiate', () => {
  cy.get('[data-cy="submit-btn"]').click();
  cy.get('[data-cy="transaction-complete"]', { timeout })
    .should('be.visible')
    .and('contain', 'contracts:Instantiated')
    .and('contain', 'system:NewAccount')
    .and('contain', 'balances:Endowed')
    .and('contain', 'balances:Transfer')
    .and('contain', 'balances:Reserved')
    .and('contain', 'balances:Withdraw')
    .and('contain', 'transactionPayment:TransactionFeePaid')
    .and('contain', 'system:ExtrinsicSuccess');
  cy.get('[data-cy="dismiss-notification"]').click();
});

Cypress.Commands.add('call', () => {
  cy.contains('Call').click();
  cy.get('[data-cy="transaction-complete"]', { timeout })
    .should('be.visible')
    .and('contain', 'system:ExtrinsicSuccess')
    .and('contain', 'balances:Transfer')
    .and('contain', 'balances:Reserved')
    .and('contain', 'balances:Withdraw')
    .and('contain', 'contracts:ContractEmitted')
    .and('contain', 'transactionPayment:TransactionFeePaid');
  cy.get('[data-cy="dismiss-notification"]').click();
});

Cypress.Commands.add('selectMessage', (name, index) => {
  cy.get('.constructorDropdown').click().find('.dropdown__option').eq(index).click();
  cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', name);
});

Cypress.Commands.add('assertReturnValue', (messageName, value) => {
  cy.contains('Read').click();
  cy.get(`[data-cy=${messageName}]`).find('.return-value').should('contain', `${value}`);
});
