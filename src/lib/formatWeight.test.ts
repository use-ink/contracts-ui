// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TypeRegistry } from '@polkadot/types';
import { beforeAll, describe, expect, it } from 'vitest';
import { formatProofSize, formatRefTime } from './formatWeight';

describe('formatProofSize', () => {
  let registry: TypeRegistry;

  beforeAll(() => {
    registry = new TypeRegistry();
  });

  it('should format edge cases correctly', () => {
    [
      { value: 0n, expected: '0.00 MB' },
      { value: 1_000_000n, expected: '1.00 MB' },
      // u64::MAX value
      {
        value: 18_446_744_073_709_551_615n,
        expected: '18446744073709.55 MB',
      },
    ].forEach(({ value, expected }) => {
      const proofSize = registry.createType('Compact<u64>', value);
      expect(formatProofSize(proofSize, 'MB')).toBe(expected);
    });
  });

  it('should format edge cases correctly', () => {
    [
      { value: 0n, expected: '0 bytes' },
      { value: 1_000_000n, expected: '1000000 bytes' },
      // u64::MAX value
      {
        value: 18_446_744_073_709_551_615n,
        expected: '18446744073709551615 bytes',
      },
    ].forEach(({ value, expected }) => {
      const proofSize = registry.createType('Compact<u64>', value);
      expect(formatProofSize(proofSize, 'bytes')).toBe(expected);
    });
  });
});

describe('formatRefTime', () => {
  let registry: TypeRegistry;

  beforeAll(() => {
    registry = new TypeRegistry();
  });

  it('should format edge cases correctly', () => {
    [
      { value: 0n, expected: '0.00 ms' },
      { value: 123n, expected: '0.00 ms' },
      { value: 123_000_000n, expected: '0.12 ms' },
      { value: 1_000_000_000n, expected: '1.00 ms' },
      // u64::MAX value
      {
        value: 18_446_744_073_709_551_615n,
        expected: '18446744073.70 ms',
      },
    ].forEach(({ value, expected }) => {
      const refTime = registry.createType('Compact<u64>', value);
      expect(formatRefTime(refTime, 'ms')).toBe(expected);
    });
  });
});
