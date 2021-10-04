// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Time } from '@polkadot/util/types';

import { useMemo } from 'react';

import { BN, BN_ONE, BN_THOUSAND, BN_TWO, bnToBn, extractTime } from '@polkadot/util';

import { useCanvas } from 'ui/contexts/CanvasContext';

type Result = [number, string, Time];

const DEFAULT_TIME = new BN(6_000);

// Some chains incorrectly use these, i.e. it is se to values such as 0 or even 2
// Use a low minimum validity threshold to check these against
const THRESHOLD = BN_THOUSAND.div(BN_TWO);

export const useBlockTime = (
  blocks: number | BN = BN_ONE,
  apiOverride?: ApiPromise | null
): Result => {
  const { api } = useCanvas();

  return useMemo((): Result => {
    const a = apiOverride || api;
    const blockTime = // Babe
    (a?.consts.babe?.expectedBlockTime ||
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
    const value = blockTime.mul(bnToBn(blocks)).toNumber();
    const time = extractTime(Math.abs(value));
    const { days, hours, minutes, seconds } = time;
    const timeStr = [
      days ? (days > 1 ? `${days} days` : '1 day') : null,
      hours ? (hours > 1 ? `${hours} hours` : '1 hr') : null,
      minutes ? (minutes > 1 ? `${minutes} mins` : '1 min') : null,
      seconds ? (seconds > 1 ? `${seconds} s` : '1 s') : null,
    ]
      .filter((s): s is string => !!s)
      .slice(0, 2)
      .join(' ');

    return [blockTime.toNumber(), `${value < 0 ? '+' : ''}${timeStr}`, time];
  }, [api, apiOverride, blocks]);
};
