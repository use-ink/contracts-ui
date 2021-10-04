import { act } from '@testing-library/react-hooks'
import { jest } from '@jest/globals';
import { extractFormFieldResult as extractResult, renderHook } from 'test-utils';
import type { OrFalsy } from 'types';
import { useFormField, Validation } from 'ui/hooks/useFormField'

type ReturnType = {
  foo: string
} | null;

function validate (value: OrFalsy<ReturnType>): Validation<ReturnType> {
  if (value === null) {
    return {
      isValid: true
    }
  }

  if (value?.foo === 'bam') {
    return {
      isValid: true,
      isWarning: true,
      message: 'Warning!'
    };
  }

  return {
    isValid: false,
    message: 'Error!'
  };
}

const consoleError = console.error;

beforeEach(() => {
  console.error = jest.fn()
})

afterEach(() => {
  console.error = consoleError
})

test('should initialize correctly', () => {
  const [{ result }] = renderHook(() => useFormField<ReturnType>({foo: 'bar'}));

  expect(extractResult(result)).toMatchObject({
    isError: false,
    isTouched: false,
    isValid: true,
    isWarning: false,
    message: null,
    value: { foo: 'bar' },
  });

  expect(typeof result.current.onChange).toBe('function');
})

test('should trigger onChange correctly', () => {
  const [{ result }] = renderHook(() => useFormField<ReturnType>({foo: 'bar'}));

  act(() => {
    result.current.onChange({ foo: 'baz' })
  })

  expect(extractResult(result)).toMatchObject({
    isError: false,
    isTouched: true,
    isValid: true,
    isWarning: false,
    message: null,
    value: { foo: 'baz' }
  });
})

test('should accept custom validation fn', () => {
  const [{ result }] = renderHook(() => useFormField<ReturnType>(null, validate));

  expect(extractResult(result)).toMatchObject({
    isError: false,
    isTouched: false,
    isValid: true,
    isWarning: false,
    message: null,
    value: null,
  });

  act(() => {
    result.current.onChange({ foo: 'bam' })
  })

  expect(extractResult(result)).toMatchObject({
    isError: false,
    isTouched: true,
    isValid: true,
    isWarning: true,
    message: 'Warning!',
    value: { foo: 'bam' }
  });

  act(() => {
    result.current.onChange({ foo: 'baz' })
  })

  expect(extractResult(result)).toMatchObject({
    isError: true,
    isTouched: true,
    isValid: false,
    isWarning: false,
    message: 'Error!',
    value: { foo: 'baz' }
  });
})
