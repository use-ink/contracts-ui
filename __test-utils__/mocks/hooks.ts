// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';
import type { ValidFormField } from 'types';

export function getMockFormField<T>(value: T, isValid = false): ValidFormField<T> {
  return {
    onChange: jest.fn(),
    value,
    isValid,
    isError: false,
  };
}
