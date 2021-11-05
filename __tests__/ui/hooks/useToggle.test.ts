// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RenderResult } from '@testing-library/react-hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import { jest } from '@jest/globals';
import type { UseToggle } from 'types';
import { useToggle } from 'ui/hooks/useToggle';

const getValue = (result: RenderResult<UseToggle>) => result.current[0];
const getToggle = (result: RenderResult<UseToggle>) => result.current[1];
const getSetter = (result: RenderResult<UseToggle>) => result.current[2];

test('should initialize with no passed value', () => {
  const { result } = renderHook(() => useToggle());

  expect(getValue(result)).toBe(false);
  expect(typeof getToggle(result)).toBe('function');
  expect(typeof getSetter(result)).toBe('function');
});

test("should initialize with 'true'", () => {
  const {
    result: {
      current: [value],
    },
  } = renderHook(() => useToggle(true));

  expect(value).toBe(true);
});

test('should toggle', () => {
  const { result } = renderHook(() => useToggle());

  expect(getValue(result)).toBe(false);

  act(() => {
    getToggle(result)();
  });

  expect(getValue(result)).toBe(true);
});

test('should manually set', () => {
  const { result } = renderHook(() => useToggle());

  expect(getValue(result)).toBe(false);

  act(() => {
    getSetter(result)(true);
  });

  expect(getValue(result)).toBe(true);
});

test('should trigger onChange callback on toggle only after first render', () => {
  const onChange = jest.fn();

  const { result } = renderHook(() => useToggle(false, onChange));

  expect(onChange).toHaveBeenCalledTimes(0);

  act(() => {
    getToggle(result)();
  });

  expect(onChange).toHaveBeenCalledTimes(1);
});
