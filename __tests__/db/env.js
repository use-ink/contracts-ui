// Copyright 2021 @paritytech/canvasui-v2 authors & contributors
// eslint-disable

import { TextDecoder, TextEncoder } from 'util';
import Environment from 'jest-environment-jsdom';

/**
 * A custom environment to set the TextEncoder that is required by TensorFlow.js.
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