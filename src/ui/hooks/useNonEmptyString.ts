// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useFormField } from './useFormField';
import type { UseFormField, Validation } from 'types';

function validate(value?: string | null): Validation {
  if (!value || value.length === 0) {
    return { isValid: false, message: 'Value cannot be empty' };
  }

  return { isValid: true };
}

export function useNonEmptyString(initialValue = ''): UseFormField<string> {
  return useFormField(initialValue, validate);
}
