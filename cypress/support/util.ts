export function beforeAllContracts() {
  cy.visit(`/instantiate/?rpc=ws://127.0.0.1:9944`);
  cy.get('[data-cy="spinner"]').should('not.exist', {
    timeout: 25000,
  });
  cy.contains('Upload and Instantiate Contract', {
    timeout: 25000,
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
