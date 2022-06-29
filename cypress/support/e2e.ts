import './commands';

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
    .and('contain', 'contracts:ContractEmitted');
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
