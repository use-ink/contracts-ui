// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
  assertInstantiate,
} from '../../support/util';

describe('Mother Contract ', () => {
  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('mother.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it('displays `name: Text` input correctly', () => {
    cy.get('.form-field.name')
      .scrollIntoView()
      .within(() => {
        cy.contains('name: Text').should('be.visible');
        cy.get("input[type='text']").should('be.visible').and('be.empty');
      });
  });

  it('displays `subject: Hash` input correctly', () => {
    cy.get('.form-field.subject').within(() => {
      cy.contains('subject: Hash').should('be.visible');
      cy.get("input[type='text']").should('be.visible');
    });
  });

  it('displays `bids: Auction` input correctly ', () => {
    cy.get('.form-field.bids').within(() => {
      cy.contains('Vec<Vec<Option<(H160,u128)>>>').should('be.visible');
      cy.contains('Vec<Option<(H160,u128)>>').should('be.visible');
      cy.get('.vector-field-1').should('have.lengthOf', 1);
      cy.get('.vector-field-2')
        .should('have.lengthOf', 1)
        .find("input[type='text']")
        .should('have.attr', 'placeholder', 'Do not supply');
      cy.get('.vector-field-3').should('not.exist');
    });
  });

  it('adds inputs on a parent Vector component', () => {
    cy.get('.form-field.bids').within(() => {
      cy.get('[data-cy="vector-add-1"]').click().click();
      cy.get('.vector-field-1').should('have.lengthOf', 3);
    });
  });

  it('adds inputs on a nested Vector component', () => {
    cy.get('.form-field.bids .vector-field-1')
      .first()
      .within(() => {
        cy.get('[data-cy="vector-add-2"]').click().click();
        cy.get('.vector-field-2').should('have.lengthOf', 3);
      });
  });
  it('displays inputs for `Option<(H160,u128)` and sets values', () => {
    cy.get('.form-field.bids .vector-field-2')
      .first()
      .each($el => {
        cy.wrap($el)
          .scrollIntoView()
          .within(() => {
            cy.get('[data-cy="switch-button"]').click();
            cy.contains('0: H160').should('be.visible');
            cy.get("input[type='text']")
              .clear()
              .type('0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01')
              .should('have.value', '0x41dccbd49b26c50d34355ed86ff0fa9e489d1e01');
            cy.contains('1: u128').should('be.visible');
            cy.get("input[type='number']").should('have.lengthOf', 1).type('99999');
          });
      });
  });
  it('removes inputs on a parent Vector component', () => {
    cy.get('.form-field.bids').within(() => {
      cy.get('[data-cy="vector-remove-1"]').click().click();
      cy.get('.vector-field-1').should('have.lengthOf', 1);
    });
  });

  it('displays 3 number inputs for `terms: [u32;3]` and sets their value', () => {
    cy.get('.form-field.terms')
      .scrollIntoView()
      .within(() => {
        cy.contains('terms: [BlockNumber;3]').should('be.visible');
        cy.get("input[type='number']").should('have.lengthOf', 3).and('be.visible');
        cy.get("input[type='number']").each($el => {
          cy.wrap($el).type('123');
        });
      });
  });

  it('displays nested enum variants for status: Status', () => {
    cy.get('.form-field.status')
      .scrollIntoView()
      .within(() => {
        cy.contains('status: Status').should('be.visible');
        cy.get('.dropdown').should('have.lengthOf', 1).and('be.visible');
        cy.get('.dropdown').click().find('.dropdown__option').eq(2).click();
        cy.get('.dropdown').find('.dropdown__single-value').should('contain', 'EndingPeriod');
        cy.contains('BlockNumber').should('exist');
        cy.get("input[type='number']").should('have.lengthOf', 1).type('99999');
        cy.get('.dropdown').click().find('.dropdown__option').eq(3).click();
        cy.get('.dropdown').should('have.lengthOf', 2);
        cy.get('.dropdown').first().find('.dropdown__single-value').should('contain', 'Ended');
        cy.contains('Outline').should('exist');
        cy.get('.dropdown').eq(1).find('.dropdown__single-value').should('contain', 'NoWinner');
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
