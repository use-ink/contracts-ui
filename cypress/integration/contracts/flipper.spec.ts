// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

describe('Flipper Contract ', () => {
  const timeout = 25000;

  it('contract file uploads', () => {
    cy.visit('http://localhost:8081/#/instantiate');
    cy.get('[data-cy="file-input"]').attachFile('flipper.contract');
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });
  it('moves to step 2', () => {
    cy.get('[data-cy="next-btn"]').click();
    cy.contains('Deployment Constructor').should('be.visible');
    cy.contains('Deployment Salt').should('be.visible');
    cy.contains('Max Gas Allowed').should('be.visible');
  });
  it('sets the init value to true', () => {
    cy.get('.form-field.initValue').click().find('.dropdown__option').eq(1).click();
    cy.get('.form-field.initValue').find('.dropdown__single-value').should('contain', 'true');
  });

  it('moves to step 3', () => {
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="transaction-queued"]').should('be.visible');
  });

  it(`submits instantiate transaction`, () => {
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
  it('redirects to contract page after instantiation', () => {
    cy.url().should('contain', '/contract/');
  });
  it('calling get() returns true', () => {
    cy.get('.constructorDropdown').click().find('.dropdown__option').eq(1).click();
    cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', 'get');
    cy.contains('Read').click();
    cy.get('[data-cy="get"]').find('.return-value').should('contain', 'true');
  });
  it(`submits flip() transaction`, () => {
    cy.get('.constructorDropdown').click().find('.dropdown__option').eq(0).click();
    cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', 'flip');
    cy.contains('Call').click();
    cy.get('[data-cy="transaction-complete"]', { timeout })
      .should('be.visible')
      .and('contain', 'system:ExtrinsicSuccess')
      .and('contain', 'balances:Withdraw');
  });
  it('calling get() returns false', () => {
    cy.get('.constructorDropdown').click().find('.dropdown__option').eq(1).click();
    cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', 'get');
    cy.contains('Read').click();
    cy.get('[data-cy="get"]').find('.return-value').should('contain', 'false');
  });
});
