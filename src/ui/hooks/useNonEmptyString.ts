import { FormField, useFormField } from './useFormField';

function isValid (value?: string | null): boolean {
  return (value && value.length > 0) || false;
}

export function useNonEmptyString (initialValue = ''): FormField<string> {
  return useFormField(initialValue, isValid);
}
