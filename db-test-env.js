// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
// eslint-disable

import { xglobal } from '@polkadot/x-global';
import Environment from 'jest-environment-jsdom';

/**
 * A custom environment to set the TextEncoder that is required.
 */
export default class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = xglobal.TextEncoder;
      this.global.TextDecoder = xglobal.TextDecoder;
    }
  }
}