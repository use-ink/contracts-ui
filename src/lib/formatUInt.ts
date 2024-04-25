// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Compact, UInt } from '@polkadot/types-codec';

export type FormattingOptions = {
  decimals: number;
  symbol: string | undefined;
  fractionDigits: number;
  digitGrouping: boolean;
};

export const formatUInt = (value: UInt | Compact<UInt>, options: FormattingOptions) => {
  if (options.decimals < 0) throw new Error('Decimals must be positive');
  if (options.fractionDigits < 0) throw new Error('Fraction digits must be positive');
  if (options.decimals < options.fractionDigits)
    throw new Error('Decimals must be greater than fraction digits');

  const valueString = value.toString();
  const integerDigits = valueString.split('');

  let fractionalPart = ''.padStart(options.decimals, '0');
  if (options.decimals !== 0) {
    const fractionDigits = integerDigits.splice(-options.decimals);
    fractionalPart = fractionDigits.join('').padStart(options.decimals, '0');
  }

  let integerPart = integerDigits.length ? integerDigits.join('') : '0';

  if (options.digitGrouping) {
    integerPart = Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
      BigInt(integerPart),
    );
  }

  if (options.fractionDigits === 0) {
    return integerPart + (options.symbol ? ` ${options.symbol}` : '');
  } else {
    return (
      integerPart +
      '.' +
      fractionalPart.slice(0, options.fractionDigits) +
      (options.symbol ? ` ${options.symbol}` : '')
    );
  }
};
