/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useApi } from 'ui/contexts/ApiContext';
import { blockTimeMs } from 'helpers';

type Result = [number];

export const useBlockTime = (): Result => {
  const { api } = useApi();

  return useMemo((): Result => {
    const blockTime = blockTimeMs(api);

    return [blockTime.toNumber()];
  }, [api]);
};
