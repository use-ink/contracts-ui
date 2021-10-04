import { renderHook } from 'test-utils';
import { useIsMounted } from 'ui/hooks/useIsMounted';

test("should initialize as 'false'", () => {
  const [{ result }] = renderHook(() => useIsMounted());

  expect(result.current).toBe(false);
});

test("should be 'true' after one render", () => {
  const [{ result, rerender }] = renderHook(() => useIsMounted());

  rerender();

  expect(result.current).toBe(true);
});
