// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Balance } from '@polkadot/types/interfaces';
import type { FormattingOptions } from './formatUInt';
import { formatUInt } from './formatUInt';

const DEFAULT_OPTIONS: FormattingOptions = {
  decimals: 12,
  fractionDigits: 2,
  symbol: undefined,
  digitGrouping: true,
};

export const formatBalance = (balance: Balance, partialOptions?: Partial<FormattingOptions>) => {
  return formatUInt(balance, { ...DEFAULT_OPTIONS, ...partialOptions });
};
