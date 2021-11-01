// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { customRenderHook } from 'test-utils';
import { useIsMounted } from 'ui/hooks/useIsMounted';

test("should initialize as 'false'", () => {
  const [{ result }] = customRenderHook(() => useIsMounted());

  expect(result.current).toBe(false);
});

test("should be 'true' after one render", () => {
  const [{ result, rerender }] = customRenderHook(() => useIsMounted());

  rerender();

  expect(result.current).toBe(true);
});
