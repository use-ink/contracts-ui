// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isNull, isUndefined } from '@polkadot/util';
import type { UseFormField, ValidateFn, Validation } from 'types';

export function useFormField<T>(
  defaultValue: T,
  validate: ValidateFn<T> = value => ({ isValid: !isNull(value), validation: null })
): UseFormField<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [validation, setValidation] = useState<Omit<Validation, 'isError'>>(validate(value));
  const isTouched = useRef(false);

  const isError = useMemo(() => {
    if (!isTouched.current) {
      return false;
    }

    return !validation.isValid;
  }, [validation.isValid, isTouched.current]);

  const onChange = useCallback((value?: T) => {
    if (!isUndefined(value)) {
      setValue(value);
      isTouched.current = true;
    }
  }, []);

  useEffect((): void => {
    setValidation(validate(value));
  }, [value]);

  return useMemo(
    () => ({
      value,
      onChange,
      isValid: validation.isValid,
      validation: validation.validation,
      isError,
    }),
    [value, onChange, isError, validation.isValid, validation.validation]
  );
}
