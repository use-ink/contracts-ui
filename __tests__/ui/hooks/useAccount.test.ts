// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mockInvalidAddress, mockKeyring, customRenderHook } from 'test-utils';
import { useAccount } from 'ui/hooks/useAccount';

describe('useAccount', () => {
  test('should fetch and return keyring account from a valid address string', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ result }] = customRenderHook(() => useAccount(account.address));

    expect(result.current).toMatchObject(account);
  });

  test('should return null if passed string is null or invalid', () => {
    let [{ result }] = customRenderHook(() => useAccount(mockInvalidAddress));

    expect(result.current).toBe(null);

    [{ result }] = customRenderHook(() => useAccount(null));

    expect(result.current).toBe(null);
  });

  test('should update when passed value is changed', () => {
    const account = mockKeyring.getAccounts()[0];
    let address: string | null = account.address;

    const [{ result, rerender }] = customRenderHook(() => useAccount(address));

    expect(result.current).toMatchObject(account);

    address = null;

    rerender();

    expect(result.current).toBe(null);
  });
});
