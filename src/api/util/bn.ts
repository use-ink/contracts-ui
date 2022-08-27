// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN } from 'bn.js';

export const BN_ZERO = new BN(0);

export const BN_ONE = new BN(1);

export const BN_TWO = new BN(2);

export const BN_TEN = new BN(10);

export const BN_HUNDRED = new BN(100);

export const BN_THOUSAND = new BN(1000);

export const BN_MILLION = new BN(1000000);

export function isBn(value: unknown): value is typeof BN_ZERO {
  return BN.isBN(value);
}
