// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Balance } from 'types';

type FormattingOptions = {
  decimals: number;
  unit?: string;
  digits: number;
};

const DEFAULT_OPTIONS: FormattingOptions = {
  decimals: 12,
  digits: 2,
};

export const formatBalance = (balance: Balance, options: FormattingOptions = DEFAULT_OPTIONS) => {
  if (options.decimals < 0) throw new Error('Decimals must be positive');
  if (options.digits < 0) throw new Error('Digits must be positive');
  if (options.decimals < options.digits) throw new Error('Decimals must be greater than digits');

  const balanceString = balance.toString();
  const integerDigits = balanceString.split('');
  const fractionDigits = integerDigits.splice(-options.decimals);

  const fractionalPart = fractionDigits.join('').padStart(options.decimals, '0');
  const integerPart = integerDigits.length ? integerDigits.join('') : '0';

  return (
    Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(BigInt(integerPart)) +
    '.' +
    fractionalPart.toString().slice(0, options.digits).padEnd(options.digits, '0') +
    (options.unit ? ` ${options.unit}` : '')
  );
};
