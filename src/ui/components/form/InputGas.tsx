// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import BN from 'bn.js';
import { Meter } from '../common/Meter';
import { InputNumber } from './InputNumber';
import { UseWeight } from 'types';

export function InputGas({
  estimatedWeight,
  setMegaGas,
  mode,
  setMode,
  maxWeight,
  setErrorMsg,
  setIsValid,
}: UseWeight) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (mode === 'estimation') {
      estimatedWeight && setDisplayValue(estimatedWeight.toString());
    }
  }, [estimatedWeight, mode, setMegaGas]);

  return (
    <div>
      <InputNumber
        value={displayValue}
        disabled={mode === 'estimation'}
        onChange={e => {
          if (mode === 'custom') {
            const bn = new BN(e.target.value);
            if (bn.lte(maxWeight)) {
              setDisplayValue(e.target.value);
              setMegaGas(bn);
              setErrorMsg('');
              setIsValid(true);
            } else {
              setErrorMsg('Value exceeds maximum block weight');
              setIsValid(false);
            }
          }
        }}
        placeholder="MGas"
        data-cy="gas-input"
        min="0"
        max={maxWeight.toString()}
      />
      <Meter
        accessory={
          mode === 'custom' ? (
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setMode('estimation');
              }}
              data-cy="use-estimated-gas"
              className="text-green-500"
            >
              Use Estimated Gas
            </a>
          ) : (
            <>
              {'Using Estimated Gas'}
              &nbsp;{' · '}&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMode('custom');
                  estimatedWeight && setMegaGas(estimatedWeight);
                }}
                className="text-green-500"
                data-cy="use-custom-gas"
              >
                Use Custom
              </a>
            </>
          )
        }
        withAccessory={true}
      />
    </div>
  );
}
