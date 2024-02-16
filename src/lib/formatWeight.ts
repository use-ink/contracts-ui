// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { WeightV2 } from '@polkadot/types/interfaces';
import { formatUInt } from './formatUInt';

/**
 * Formats given Reference Time value from expected picoseconds to milliseconds.
 * @param refTime
 * @returns formatted refTime in milliseconds, with 2 decimal places
 */
export function formatRefTime(refTime: WeightV2['refTime'], unit: 'ms' | 'ps' = 'ps'): string {
  switch (unit) {
    case 'ps':
      return formatUInt(refTime, {
        decimals: 0,
        digitGrouping: false,
        fractionDigits: 0,
        symbol: unit,
      });
    case 'ms':
      return formatUInt(refTime, {
        decimals: 9,
        digitGrouping: false,
        fractionDigits: 2,
        symbol: unit,
      });
    default:
      throw new Error('Unsupported unit');
  }
}

/**
 * Formats given Proof Size value from expected bytes to megabytes.
 * @param refTime
 * @returns formatted refTime in megabytes, with 2 decimal places
 */
export function formatProofSize(
  proofSize: WeightV2['proofSize'],
  unit: 'MB' | 'bytes' | 'kb' = 'bytes',
): string {
  switch (unit) {
    case 'bytes':
      return formatUInt(proofSize, {
        decimals: 0,
        digitGrouping: false,
        fractionDigits: 0,
        symbol: unit,
      });
    case 'kb':
      return formatUInt(proofSize, {
        decimals: 3,
        digitGrouping: false,
        fractionDigits: 2,
        symbol: unit,
      });
    case 'MB':
      return formatUInt(proofSize, {
        decimals: 6,
        digitGrouping: false,
        fractionDigits: 2,
        symbol: unit,
      });
    default:
      throw new Error('Unsupported unit');
  }
}
