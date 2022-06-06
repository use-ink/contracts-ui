// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

describe('ERC20 Contract ', () => {
  const initialSupply = 77;
  const transferValue = 2;
  const timeout = 25000;

  it('contract file uploads', () => {
    cy.visit('http://localhost:8081/#/instantiate');
    cy.get('[data-cy="file-input"]').attachFile('erc20.contract');
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });
  it('moves to step 2', () => {
    cy.get('[data-cy="next-btn"]').click();
    cy.contains('Deployment Constructor').should('be.visible');
    cy.contains('Deployment Salt').should('be.visible');
    cy.contains('Max Gas Allowed').should('be.visible');
  });

  it(`types ${initialSupply} in the initialSupply field`, () => {
    cy.get('.form-field.initialSupply').find('input[type="text"]').eq(0).type(`${initialSupply}`);
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });

  it('moves to step 3', () => {
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="transaction-queued"]').should('be.visible');
  });

  it('submits instantiate transaction', () => {
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
  });
  it('redirects to contract page after instantiation', () => {
    cy.url().should('contain', '/contract/');
  });
  it(`calling totalSupply() returns ${initialSupply}`, () => {
    cy.contains('Read').click();
    cy.get('[data-cy="totalSupply"]').find('.return-value').should('contain', `${initialSupply}`);
  });
  it(`transfers ${transferValue} Units to another account`, () => {
    cy.get('.constructorDropdown').click().find('.dropdown__option').eq(3).click();
    cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', 'transfer');
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(3).click();
    cy.get('.form-field.value').find('input[type="text"]').eq(0).type(`${transferValue}`);
    cy.contains('Call').click();
    cy.get('[data-cy="transaction-complete"]', { timeout })
      .should('be.visible')
      .and('contain', 'system:ExtrinsicSuccess')
      .and('contain', 'balances:Transfer')
      .and('contain', 'balances:Reserved')
      .and('contain', 'balances:Withdraw');
  });
});
