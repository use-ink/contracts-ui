/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Time } from '@polkadot/util/types';

import { useMemo } from 'react';

import { BN, BN_ONE, bnToBn, extractTime } from '@polkadot/util';

import { useApi } from 'ui/contexts/ApiContext';
import { blockTimeMs } from 'api/util/blockTime';

type Result = [number, string, Time];

export const useBlockTime = (
  blocks: number | BN = BN_ONE,
  apiOverride?: ApiPromise | null
): Result => {
  const { api } = useApi();

  return useMemo((): Result => {
    const a = apiOverride || api;
    const blockTime = blockTimeMs(a);
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
