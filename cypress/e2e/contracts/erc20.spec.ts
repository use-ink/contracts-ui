// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
  assertInstantiate,
  assertCall,
  assertReturnValue,
  selectMessage,
} from '../../support/util';

describe('ERC20 Contract ', () => {
  const initialSupply = 77;
  const transferValue = 2;
  const allowance = 2;

  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('erc20.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it(`types ${initialSupply} in the totalSupply field`, () => {
    cy.get('.form-field.totalSupply').find('input[type="number"]').eq(0).type(`${initialSupply}`);
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });

  it('moves to step 3', () => {
    assertMoveToStep3();
  });

  it('submits instantiate transaction', () => {
    assertInstantiate();
  });

  it('redirects to contract page after instantiation', () => {
    assertContractRedirect();
  });

  it(`calling totalSupply() returns ${initialSupply}`, () => {
    assertReturnValue('totalSupply', `${initialSupply}`);
  });

  it(`transfers ${transferValue} Units to another account`, () => {
    selectMessage('transfer', 3);
    cy.get('.form-field.to')
      .find("input[type='text']")
      .clear()
      .type('0x60afa252b554aabc4b3253ca2be60dc1d536ec10')
      .should('have.value', '0x60afa252b554aabc4b3253ca2be60dc1d536ec10');
    cy.get('.form-field.value').find('input[type="number"]').type(`${transferValue}`);
    assertCall();
    selectMessage('balanceOf', 1);

    cy.get('.form-field.owner')
      .find("input[type='text']")
      .clear()
      .type('0x9621dde636de098b43efb0fa9b61facfe328f99d')
      .should('have.value', '0x9621dde636de098b43efb0fa9b61facfe328f99d');
    assertReturnValue('balanceOf', `${initialSupply - transferValue}`);
  });

  it(`successfully approves allowance`, () => {
    selectMessage('approve', 4);
    cy.get('.form-field.spender')
      .find("input[type='text']")
      .clear()
      .type('0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01')
      .should('have.value', '0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01');
    cy.get('.form-field.value').find('input[type="number"]').type(`${allowance}`);
    assertCall();
    selectMessage('allowance', 2);
    cy.get('.form-field.owner')
      .find("input[type='text']")
      .clear()
      .type('0x9621dde636de098b43efb0fa9b61facfe328f99d')
      .should('have.value', '0x9621dde636de098b43efb0fa9b61facfe328f99d');
    cy.get('.form-field.spender')
      .find("input[type='text']")
      .clear()
      .type('0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01')
      .should('have.value', '0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01');
    assertReturnValue('allowance', `${allowance}`);
  });

  it(`transfers ${transferValue} on behalf of alice`, () => {
    cy.get('.form-field.caller').click().find('.dropdown__option').eq(2).click();
    selectMessage('transferFrom', 5);
    cy.get('.form-field.from')
      .find("input[type='text']")
      .clear()
      .type('0x9621dde636de098b43efb0fa9b61facfe328f99d')
      .should('have.value', '0x9621dde636de098b43efb0fa9b61facfe328f99d');
    cy.get('.form-field.to')
      .find("input[type='text']")
      .clear()
      .type('0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01')
      .should('have.value', '0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01');
    cy.get('.form-field.value').find('input[type="number"]').type(`${transferValue}`);
    assertCall();
    selectMessage('balanceOf', 1);
    cy.get('.form-field.owner')
      .find("input[type='text']")
      .clear()
      .type('0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01')
      .should('have.value', '0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01');
    assertReturnValue('balanceOf', `${transferValue}`);
  });
});
