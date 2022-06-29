/// <reference types="cypress" />
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      instantiate(): Chainable<Element>;
      call(): Chainable<Element>;
      selectMessage(name: string, index: number): Chainable<Element>;
      assertReturnValue(messageName: string, value: string): Chainable<Element>;
    }
  }
}
