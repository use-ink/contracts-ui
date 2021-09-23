import { UseFormField, useFormField, Validation } from './useFormField';

function isValid (value?: string | null): Validation {
  if (!value || value.length === 0 ) {
    return { isValid: false, validation: 'Value cannot be empty' };
  }

  return { isValid: true };
}

export function useNonEmptyString (initialValue = ''): UseFormField<string> {
  return useFormField(initialValue, isValid);
}
