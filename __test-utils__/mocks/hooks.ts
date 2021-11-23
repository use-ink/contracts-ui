// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { jest } from '@jest/globals';
import type { UseFormField } from 'types';

export function getMockFormField<T>(value: T, isValid = false): UseFormField<T> {
  return {
    onChange: jest.fn(),
    value,
    isValid,
    isError: false,
  };
}
