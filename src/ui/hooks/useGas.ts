/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useApi } from 'ui/contexts/ApiContext';
import type { BN, UIGas, InputMode } from 'types';
import { maximumBlockWeight, BN_ZERO } from 'helpers';

const weightSchema = Yup.number().positive('Value must be positive').min(1).required();

export const useGas = (estimatedGas?: BN): UIGas => {
  const { api } = useApi();
  const [limit, setLimit] = useState<BN>(estimatedGas ?? BN_ZERO);
  const [mode, setMode] = useState<InputMode>('estimation');
  const max = useMemo((): BN => maximumBlockWeight(api), [api]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isValid, setIsValid] = useState(true);
  const displayGas = limit.toString();

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
    max,
    isValid,
    limit,
    setLimit,
    mode,
    setMode,
    errorMsg,
    setErrorMsg,
    setIsValid,
  };
};
