/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BN_MILLION, BN_TEN, BN_ZERO } from '@polkadot/util';
import { useBlockTime } from './useBlockTime';
import { useApi } from 'ui/contexts/ApiContext';
import type { ApiPromise, BN, OrFalsy, UseWeight } from 'types';
import { maximumBlockWeight } from 'api';

function getEstimatedMegaGas(api: ApiPromise, estimatedWeight: OrFalsy<BN>, withBuffer = true): BN {
  return (estimatedWeight || maximumBlockWeight(api)).div(BN_MILLION).addn(withBuffer ? 1 : 0);
}

function getDefaultMegaGas(api: OrFalsy<ApiPromise>, estimatedWeight?: OrFalsy<BN>): BN {
  if (api && estimatedWeight) {
    return getEstimatedMegaGas(api, estimatedWeight);
  }

  return maximumBlockWeight(api).div(BN_MILLION).div(BN_TEN);
}

export const useWeight = (estimatedWeight: OrFalsy<BN>): UseWeight => {
  // const estimatedWeightRef = useRef(estimatedWeight);
  const { api } = useApi();
  const [blockTime] = useBlockTime();
  const [megaGas, _setMegaGas] = useState<BN>(getDefaultMegaGas(api, estimatedWeight));
  const [isActive, setIsActive] = useState(!!estimatedWeight);

  const defaultWeight = useMemo((): BN => maximumBlockWeight(api), [api]);

  const setMegaGas = useCallback(
    (value?: BN | undefined) => {
      _setMegaGas(value || getDefaultMegaGas(api, null));
    },
    [api]
  );

  useEffect((): void => {
    if (!isActive) {
      _setMegaGas(getDefaultMegaGas(api, estimatedWeight));
    }
  }, [api, estimatedWeight, isActive]);

  return useMemo((): UseWeight => {
    let executionTime = 0;
    let percentage = 0;
    let weight = BN_ZERO;
    let isValid = false;

    if (megaGas) {
      weight = megaGas.mul(BN_MILLION);
      executionTime = weight.muln(blockTime).div(maximumBlockWeight(api)).toNumber();
      percentage = (executionTime / blockTime) * 100;

      // execution is 2s of 6s blocks, i.e. 1/3
      executionTime = executionTime / 3000;
      isValid = !megaGas.isZero() && percentage < 65;
    }

    return {
      defaultWeight,
      estimatedWeight,
      executionTime,
      isActive,
      isValid: !isActive || isValid,
      megaGas: megaGas || BN_ZERO,
      percentage,
      setIsActive,
      setMegaGas,
      weight,
    };
  }, [api, blockTime, defaultWeight, estimatedWeight, isActive, megaGas, setIsActive, setMegaGas]);
};
