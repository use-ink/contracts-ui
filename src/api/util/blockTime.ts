// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_THOUSAND, BN_TWO, BN } from '@polkadot/util';
import { ApiPromise, OrFalsy } from 'types';

const DEFAULT_TIME = new BN(6_000);

const THRESHOLD = BN_THOUSAND.div(BN_TWO);

export function blockTimeMs(a: OrFalsy<ApiPromise>): BN {
  return (a?.consts.babe?.expectedBlockTime || // Babe
    // POW, eg. Kulupu
    a?.consts.difficulty?.targetBlockTime ||
    // Check against threshold to determine value validity
    (a?.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
      ? // Default minimum period config
        a.consts.timestamp.minimumPeriod.mul(BN_TWO)
      : a?.query.parachainSystem
      ? // default guess for a parachain
        DEFAULT_TIME.mul(BN_TWO)
      : // default guess for others
        DEFAULT_TIME)) as BN;
}
