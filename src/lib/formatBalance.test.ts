// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TypeRegistry } from '@polkadot/types';
import { beforeAll, describe, expect, it } from 'vitest';
import { formatBalance } from './formatBalance';

describe('formatBalance', () => {
  let registry: TypeRegistry;

  beforeAll(() => {
    registry = new TypeRegistry();
  });

  it('should throw on invalid options', () => {
    expect(() =>
      formatBalance(registry.createType('Balance', 1), { decimals: -1, fractionDigits: 0 }),
    ).toThrow();

    expect(() =>
      formatBalance(registry.createType('Balance', 1), { decimals: 0, fractionDigits: -1 }),
    ).toThrow();

    expect(() =>
      formatBalance(registry.createType('Balance', 1), { decimals: 0, fractionDigits: 1 }),
    ).toThrow();
  });

  it('should format edge cases correctly', () => {
    [
      { value: 0n, expected: '0.00' },
      { value: 1_000_000_000_000n, expected: '1.00' },
      // u128::MAX value
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '340,282,366,920,938,463,463,374,607.43',
      },
    ].forEach(({ value, expected }) => {
      const balance = registry.createType('Balance', value);
      expect(formatBalance(balance)).toBe(expected);
    });
  });

  it('edge cases with custom options', () => {
    const cases = [
      { value: 0n, expected: '0.0000', options: { decimals: 4, fractionDigits: 4 } },
      {
        value: 123456789n,
        expected: '1.23456789',
        options: { decimals: 8, fractionDigits: 8 },
      },
      {
        value: 1_123_456_789_101_112_134n,
        expected: '1.123456789101112134',
        options: { decimals: 18, fractionDigits: 18 },
      },
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '3.40282366920938463463374607431768211455',
        options: { decimals: 38, fractionDigits: 38 },
      },
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '0.00000000000340282366920938463463374607',
        options: { decimals: 50, fractionDigits: 38 },
      },
    ];

    cases.forEach(({ value, expected, options }) => {
      const balance = registry.createType('Balance', value);
      expect(formatBalance(balance, options)).toBe(expected);
    });
  });
});
