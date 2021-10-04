import { mockInvalidAddress, mockKeyring, renderHook } from 'test-utils';
import { useAccount } from 'ui/hooks/useAccount'

describe('useAccount', () => {
  test('should fetch and return keyring account from a valid address string', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ result }] = renderHook(() => useAccount(account.address));

    expect(result.current).toMatchObject(account);
  })

  test('should return null if passed string is null or invalid', () => {
    let [{ result }] = renderHook(() => useAccount(mockInvalidAddress));

    expect(result.current).toBe(null);

    [{ result }] = renderHook(() => useAccount(null));

    expect(result.current).toBe(null);
  })

  test('should update when passed value is changed', () => {
    const account = mockKeyring.getAccounts()[0];
    let address: string | null = account.address;

    const [{ result, rerender }] = renderHook(() => useAccount(address));

    expect(result.current).toMatchObject(account);

    address = null;

    rerender();

    expect(result.current).toBe(null);
  })
});
