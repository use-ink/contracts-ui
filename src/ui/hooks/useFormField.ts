import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isNull, isUndefined } from '@polkadot/util';

export interface UseFormField<T> extends Validation {
  value?: T;
  onChange: (_: T) => void;
};

export interface Validation {
  isError?: boolean;
  isSuccess?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  validation?: React.ReactNode;
};

type ValidateFn<T> = (_?: T | null) => Omit<Validation, 'isError'>

export function useFormField<T> (defaultValue: T, validate: ValidateFn<T> = (value) => ({ isValid: !isNull(value), validation: null })): UseFormField<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [validation, setValidation] = useState<Omit<Validation, 'isError'>>(validate(value));
  const isTouched = useRef(false);

  const isError = useMemo(
    () => {
      if (!isTouched.current) {
        return false;
      }
      
      return !validation.isValid;
    },
    [validation.isValid, isTouched.current]
  );

  const onChange = useCallback(
    (value?: T) => {
      if (!isUndefined(value)) {
        setValue(value);
        isTouched.current = true;
      }
    },
    []
  );

  useEffect(
    (): void => {
      setValidation(validate(value));
    },
    [value]
  )

  return useMemo(
    () => ({ value, onChange, isValid: validation.isValid, validation: validation.validation, isError }),
    [value, onChange, isError, validation.isValid, validation.validation]
  );
}
