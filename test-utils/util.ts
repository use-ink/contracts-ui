import { RenderResult } from '@testing-library/react-hooks';
import { UseFormField } from 'types';

export function timeout(ms = 10) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getNodeText(node: React.ReactNode): string {
  if (['string', 'number'].includes(typeof node)) return (node as string).toString();

  if (node instanceof Array) return node.map(getNodeText).join('');

  return getNodeText((node as unknown as React.ReactElement).props.children);
}

export function extractFormFieldResult<T>(
  result: RenderResult<UseFormField<T>>
): Partial<Omit<UseFormField<T>, 'onChange'>> {
  return {
    isError: result.current.isError,
    isTouched: result.current.isTouched,
    isValid: result.current.isValid,
    isWarning: result.current.isWarning,
    message: result.current.message,
    value: result.current.value,
  };
}
