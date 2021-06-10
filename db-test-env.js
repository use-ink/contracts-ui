// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { TextEncoder, TextDecoder } from 'util';
import Environment from 'jest-environment-jsdom';

/**
 * A custom environment to set the TextEncoder that is required.
 */
export default class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
}