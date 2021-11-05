// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { act } from '@testing-library/react-hooks';
import {
  extractFormFieldResult as extractResult,
  mockInvalidAddress,
  mockKeyring,
  customRenderHook,
} from 'test-utils';
import { useAccountId } from 'ui/hooks/useAccountId';

describe('useAccountId', () => {
  test('should initialize correctly with default value of accounts[0]', () => {
    const [{ result }, { keyring }] = customRenderHook(() => useAccountId());

    expect(extractResult(result)).toMatchObject({
      isError: false,
      isTouched: false,
      isValid: true,
      isWarning: false,
      message: null,
      value: keyring?.getAccounts()[0].address,
    });

    expect(typeof result.current.onChange).toBe('function');
  });

  test('should initialize correctly with passed initial value', () => {
    const initialValue = mockKeyring.getAccounts()[1].address;

    const [{ result }] = customRenderHook(() => useAccountId(initialValue));

    expect(extractResult(result)).toMatchObject({
      isError: false,
      isTouched: false,
      isValid: true,
      isWarning: false,
      message: null,
      value: initialValue,
    });
  });

  test('should reject null or unmatched account address', () => {
    const [{ result }] = customRenderHook(() => useAccountId());

    act(() => {
      result.current.onChange(null);
    });

    expect(extractResult(result)).toMatchObject({
      isError: true,
      isTouched: true,
      isValid: false,
      isWarning: false,
      message: 'Specified account does not exist',
      value: null,
    });

    act(() => {
      result.current.onChange(mockInvalidAddress);
    });

    expect(extractResult(result)).toMatchObject({
      isError: true,
      isTouched: true,
      isValid: false,
      isWarning: false,
      message: 'Specified account does not exist',
      value: mockInvalidAddress,
    });

    const valid = mockKeyring.getAccounts()[0].address;

    act(() => {
      result.current.onChange(valid);
    });

    expect(extractResult(result)).toMatchObject({
      isError: false,
      isTouched: true,
      isValid: true,
      isWarning: false,
      message: null,
      value: valid,
    });
  });
});
