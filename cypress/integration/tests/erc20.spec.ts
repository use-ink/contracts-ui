// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

describe('ERC20 Contract ', () => {
  it('instantiate', () => {
    cy.visit('http://localhost:8081/#/instantiate');
    cy.get('[data-cy="file-input"]').attachFile('erc20.contract');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('.form-field.initialSupply').find('input[type="text"]').eq(0).type('77');
    cy.get('[data-cy="next-btn"]').click();
    cy.get('[data-cy="submit-btn"]').click();
    cy.get('[data-cy="transaction-complete"]', { timeout: 25000 })
      .should('be.visible')
      .should('contain', 'contracts:Instantiated');
  });
  it('call', () => {
    cy.url().should('contain', '/contract/');
    cy.contains('Read').click();
    cy.get('[data-cy="totalSupply"]').find('.return-value').should('contain.text', '77');
    cy.get('.constructorDropdown').click().find('.dropdown__option').eq(3).click();
    cy.get('.constructorDropdown').find('.dropdown__single-value').should('contain', 'transfer');
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(3).click();
  });
});
