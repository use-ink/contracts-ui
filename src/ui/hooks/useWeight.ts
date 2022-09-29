/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useApi } from 'ui/contexts/ApiContext';
import type { BN, UseWeight, InputMode } from 'types';
import { maximumBlockWeight, BN_ZERO } from 'helpers';

const weightSchema = Yup.number().positive('Value must be positive').min(1).required();

export const useWeight = (estimatedWeight?: BN): UseWeight => {
  const { api } = useApi();
  const [megaGas, setMegaGas] = useState<BN>(estimatedWeight ?? BN_ZERO);
  const [mode, setMode] = useState<InputMode>('estimation');
  const maxWeight = useMemo((): BN => maximumBlockWeight(api), [api]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isValid, setIsValid] = useState(true);
  const displayGas = megaGas.toString();

  useEffect(() => {
    async function validate() {
      try {
        const valid = await weightSchema.validate(displayGas);
        if (valid) {
          setIsValid(true);
          setErrorMsg('');
        }
      } catch (err) {
        const { errors } = (err as { errors: string[] }) ?? { errors: [''] };
        setIsValid(false);
        setErrorMsg(errors[0]);
      }
    }
    validate().catch(e => console.error(e));
  }, [displayGas]);

  return {
    maxWeight,
    estimatedWeight,
    isValid,
    megaGas,
    setMegaGas,
    mode,
    setMode,
    errorMsg: mode === 'custom' ? errorMsg : '',
    setErrorMsg,
    setIsValid,
  };
};
