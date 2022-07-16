// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
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

  it(`types ${initialSupply} in the initialSupply field`, () => {
    cy.get('.form-field.initialSupply').find('input[type="text"]').eq(0).type(`${initialSupply}`);
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });

  it('moves to step 3', () => {
    assertMoveToStep3();
  });

  it('submits instantiate transaction', () => {
    cy.instantiate();
  });

  it('redirects to contract page after instantiation', () => {
    assertContractRedirect();
  });

  it(`calling totalSupply() returns ${initialSupply}`, () => {
    cy.assertReturnValue('totalSupply', `${initialSupply}`);
  });

  it(`transfers ${transferValue} Units to another account`, () => {
    cy.selectMessage('transfer', 3);
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(3).click();
    cy.get('.form-field.value').find('input[type="text"]').eq(0).type(`${transferValue}`);
    cy.call();
    cy.selectMessage('balanceOf', 1);
    cy.assertReturnValue('balanceOf', `${initialSupply - transferValue}`);
  });

  it(`successfully approves allowance`, () => {
    cy.selectMessage('approve', 4);
    cy.get('.form-field.spender').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.get('.form-field.value').find('input[type="text"]').type(`${allowance}`);
    cy.call();
    cy.selectMessage('allowance', 2);
    cy.get('.form-field.spender').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.assertReturnValue('allowance', `${allowance}`);
  });

  it(`transfers ${transferValue} on behalf of alice`, () => {
    cy.get('.form-field.caller').click().find('.dropdown__option').eq(2).click();
    cy.selectMessage('transferFrom', 5);
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.get('.form-field.value').find('input[type="text"]').type(`${transferValue}`);
    cy.call();
    cy.selectMessage('balanceOf', 1);
    cy.get('.form-field.owner').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.assertReturnValue('balanceOf', `${transferValue}`);
  });
});
