// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
  assertInstantiate,
  selectMessage,
} from '../../support/util';

describe('Storage Types Contract', () => {
  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('storage_types.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
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

  [
    'getUnsignedIntegers',
    'getSignedIntegers',
    'getInkPreludeTypes',
    'getSubstrateTypes',
    'getPrimitiveTypes',
    'getOptionSome',
    'getOptionNone',
    'getResultOk',
    'getResultError',
    'getPanic',
  ].forEach((message, index) => {
    it(`DryRun ${message}`, () => {
      cy.get('.form-field.caller').click().find('.dropdown__option').eq(2).click();
      selectMessage(message, index);

      cy.get('[data-cy="output"]').find('code').snapshot();
    });
  });
});
