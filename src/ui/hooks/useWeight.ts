/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import type { BN, UseWeight, InputMode } from 'types';
import { maximumBlockWeight, BN_ZERO } from 'helpers';

export const useWeight = (estimatedWeight?: BN): UseWeight => {
  const { api } = useApi();
  const [megaGas, setMegaGas] = useState<BN>(BN_ZERO);
  const [mode, setMode] = useState<InputMode>('estimation');
  const defaultWeight = useMemo((): BN => maximumBlockWeight(api), [api]);
  return {
    defaultWeight,
    estimatedWeight,
    isValid: mode === 'estimation' || (mode === 'custom' && !megaGas.isZero()),
    megaGas,
    setMegaGas,
    mode,
    setMode,
  };
};
