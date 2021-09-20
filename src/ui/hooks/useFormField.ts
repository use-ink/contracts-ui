import { useCallback, useMemo, useRef, useState } from 'react';

import { isUndefined } from '@polkadot/util';

export type FormField<T> = [
  T,
  (_?: T) => void,
  boolean,
  boolean
];

type ValidateFn<T> = (_: T) => boolean;

export function useFormField<T> (defaultValue: T, validate: ValidateFn<T> = (): boolean => true): FormField<T> {
  const [value, _setValue] = useState<T>(defaultValue);
  const isTouched = useRef(false);

  const isValid = useMemo(
    () => !!value && validate(value),
    [validate, value]
  );

  const isError = useMemo(
    () => !isValid && isTouched.current,
    [isValid, isTouched.current]
  );

  const setValue = useCallback(
    (value?: T) => {
      if (!isUndefined(value)) {
        _setValue(value);
        isTouched.current = true
      }
    },
    []
  );

  return [value, setValue, isValid, isError];
}
