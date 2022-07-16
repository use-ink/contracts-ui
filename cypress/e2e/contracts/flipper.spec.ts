// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
} from '../../support/util';

describe('Flipper Contract ', () => {
  const timeout = 25000;

  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('flipper.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it('sets the init value to true', () => {
    cy.get('.form-field.initValue').click().find('.dropdown__option').eq(1).click();
    cy.get('.form-field.initValue').find('.dropdown__single-value').should('contain', 'true');
  });

  it('moves to step 3', () => {
    assertMoveToStep3();
  });

  it(`submits instantiate transaction`, () => {
    cy.instantiate();
  });
  it('redirects to contract page after instantiation', () => {
    assertContractRedirect();
  });
  it('calling get() returns true', () => {
    cy.selectMessage('get', 1);
    cy.assertReturnValue('get', 'true');
  });
  it(`submits flip() transaction`, () => {
    cy.selectMessage('flip', 0);
    cy.contains('Call').click();
    cy.get('[data-cy="transaction-complete"]', { timeout })
      .should('be.visible')
      .and('contain', 'system:ExtrinsicSuccess')
      .and('contain', 'balances:Withdraw');
  });
  it('calling get() returns false', () => {
    cy.selectMessage('get', 1);
    cy.assertReturnValue('get', 'false');
  });
});
