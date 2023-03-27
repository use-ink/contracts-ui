// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
  assertInstantiate,
} from '../../support/util';
export function assertFormField(argument: string, type: string, inputType = 'text') {
  cy.get(`.form-field.${argument}`)
    .scrollIntoView()
    .within(() => {
      cy.contains(`${argument}: ${type}`).should('be.visible');
      cy.get(`input[type='${inputType}']`).should('be.visible').and('be.empty');
    });
}
describe('Multisig Contract', () => {
  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('multisig.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it('displays `requirement: u32` input correctly', () => {
    // assertFormField('requirement', 'u32', 'number');
    cy.get('.form-field.requirement')
      .scrollIntoView()
      .within(() => {
        cy.contains('requirement: u32').should('be.visible');
        cy.get("input[type='number']").should('be.visible').and('be.empty');
      });
  });

  it('displays `owners: Vec<AccountId>` input correctly', () => {
    cy.get('.form-field.owners').within(() => {
      cy.contains('Vec<AccountId>').should('be.visible');
      cy.get('.vector-field-0')
        .should('have.lengthOf', 1)
        .within(() => {
          cy.get('.account-select').should('be.visible');
        });

      cy.get('.vector-field-1').should('not.exist');
    });
  });

  it('adds inputs on a parent Vector component', () => {
    cy.get('.form-field.owners').within(() => {
      cy.get('[data-cy="vector-add-0"]').click().click();
      cy.get('.vector-field-0').should('have.lengthOf', 3);
    });
  });

  it('removes inputs on a parent Vector component', () => {
    cy.get('.form-field.owners').within(() => {
      cy.get('[data-cy="vector-remove-0"]').click().click();
      cy.get('.vector-field-0').should('have.lengthOf', 1);
    });
  });

  it('fill out form', () => {
    // Set Requirement to 2
    cy.get('.form-field.requirement').type('2');

    // Adds 3 owners
    cy.get('.form-field.owners').within(() => {
      cy.get('[data-cy="vector-add-0"]').click().click();

      const owners = ['alice', 'bob', 'charlie'];

      cy.get('.vector-field-0')
        .should('have.lengthOf', 3)
        .each(($el, index) => {
          cy.wrap($el).within(() => {
            cy.get('.dropdown').click().find('.dropdown__option').contains(owners[index]).click();
          });
        });
    });
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
});
