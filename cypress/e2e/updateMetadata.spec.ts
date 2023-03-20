// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { beforeAllContracts, deploy } from '../support/util';

describe('Update contract metadata', () => {
  const messages1 = ['new', 'newDefault', 'failedNew', 'echoAuction', 'revertOrTrap', 'debugLog'];
  const messages2 = ['new', 'newDefault', 'flip', 'get'];

  before(() => {
    beforeAllContracts();
    deploy('mother.contract');
  });
  it('displays a list of docs for the contract messages', () => {
    cy.get('[data-cy="contract-page-tabs"]').within(() => {
      cy.contains('Metadata').click();
    });
    cy.get('[data-cy="message-docs"]').each((item, i, list) => {
      expect(list).to.have.length(6);
      expect(Cypress.$(item).text()).to.contain(messages1[i]);
    });
    cy.contains('No documentation provided').should('be.visible');
    cy.contains('Demonstrates the ability to fail a constructor safely').should('be.visible');
    cy.contains('Takes an auction data struct as input and returns it back.').should('be.visible');
    cy.contains('Update metadata').should('be.disabled');
  });
  it('uploads a different metadata file', () => {
    cy.get('[data-cy="file-input"]').attachFile('flipper.contract');
    cy.contains('Update metadata').should('not.be.disabled').click();
  });
  it('displays the docs for the new metadata', () => {
    cy.get('[data-cy="message-docs"]').each((item, i, list) => {
      expect(list).to.have.length(4);
      expect(Cypress.$(item).text()).to.contain(messages2[i]);
    });
  });
  it('clears the file input', () => {
    cy.contains('Click to select or drag and drop to upload file.')
      .scrollIntoView()
      .should('be.visible');
  });
});
