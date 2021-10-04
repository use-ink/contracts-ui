import { useFormField } from './useFormField';
import type { OrFalsy, UseFormField } from 'types';

type Value = OrFalsy<string>;

function validate(value?: Value) {
  if (!value || value.length === 0) {
    return { isValid: false, message: 'Value cannot be empty' };
  }

  return { isValid: true };
}

export function useNonEmptyString(initialValue = ''): UseFormField<Value> {
  return useFormField<OrFalsy<string>>(initialValue, validate);
}
