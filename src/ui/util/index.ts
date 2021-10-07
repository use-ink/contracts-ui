// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { twMerge } from 'tailwind-merge';

export const classes = twMerge;

export const MOCK_CONTRACT_DATA: [string, number, string[], unknown[]][] = [
  ['Flipper', 0, ['alpha', 'beta'], [true]],
  ['ERC20', 1, ['alpha', 'beta', 'gamma'], [1000000000000n * 1000000n]],
  ['DNS', 2, ['delta'], []],
  ['Incrementer', 1, ['beta', 'delta', 'gamma'], [7]],
];
