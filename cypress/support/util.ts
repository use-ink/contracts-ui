const timeout = 25000;

export function beforeAllContracts() {
  cy.visit(`/instantiate/?rpc=ws://127.0.0.1:9944`);
  cy.get('[data-cy="spinner"]').should('not.exist', {
    timeout,
  });
  cy.contains('Upload and Instantiate Contract', {
    timeout,
  }).should('be.visible');
}
export function assertUpload(fixture: Cypress.FixtureData) {
  cy.get('[data-cy="file-input"]').attachFile(fixture);
  cy.get('[data-cy="next-btn"]').should('not.be.disabled');
}

export function assertMoveToStep2() {
  cy.get('[data-cy="next-btn"]').click();
  cy.contains('Deployment Constructor').scrollIntoView().should('be.visible');
  cy.contains('Deployment Salt').scrollIntoView().should('be.visible');
  cy.contains('Max Gas Allowed').scrollIntoView().should('be.visible');
}

export function assertMoveToStep3() {
  cy.get('[data-cy="next-btn"]').scrollIntoView().click();
  cy.get('[data-cy="transaction-queued"]').should('be.visible');
}

export function assertContractRedirect() {
  cy.url().should('contain', '/contract/');
}

export function assertInstantiate() {
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
}

export function assertCall() {
  cy.contains('Call').click();
  cy.get('[data-cy="transaction-complete"]', { timeout })
    .should('be.visible')
    .and('contain', 'system:ExtrinsicSuccess')
    .and('contain', 'balances:Transfer')
    .and('contain', 'balances:Reserved')
    .and('contain', 'balances:Withdraw')
    .and('contain', 'contracts:ContractEmitted');
  cy.get('[data-cy="dismiss-notification"]').click();
}

export function selectMessage(name: string, index: number) {
  cy.get('.constructorDropdown').click().find('.dropdown__option').eq(index).click();
  cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', name);
}

export function selectAccount(name: string, index: number) {
  cy.get('.account-select').click().find('.dropdown__option').eq(index).click();
  cy.get('.account-select')
    .find('.dropdown__single-value')
    .find('[data-cy="account-name"]')
    .should('contain', name);
}

export function assertReturnValue(messageName: string, value: string) {
  cy.contains('Read').click();
  cy.get(`[data-cy=${messageName}]`).find('.return-value').should('contain', `${value}`);
}
