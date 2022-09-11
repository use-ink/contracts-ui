// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { Meter } from '../common/Meter';
import { InputNumber } from './InputNumber';
import { BN_MILLION, BN_ONE, BN_ZERO } from 'helpers';
import type { InputMode, UseWeight } from 'types';

export function InputGas({ estimatedWeight, megaGas, setMegaGas }: UseWeight) {
  const [mode, setMode] = useState<InputMode>('estimation');
  console.log(mode);

  return (
    <div>
      <InputNumber
        value={megaGas}
        isDisabled={mode === 'estimation'}
        onChange={value => {
          if (mode === 'custom') {
            setMegaGas(value);
          }
        }}
        placeholder="MGas"
        data-cy="gas-input"
      />
      <Meter
        accessory={
          mode === 'custom' ? (
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setMode('estimation');
                estimatedWeight && setMegaGas(estimatedWeight);
              }}
              data-cy="use-estimated-gas"
              className="text-green-500"
            >
              {`Use Estimated Gas (${(estimatedWeight || BN_ZERO)
                .div(BN_MILLION)
                .add(BN_ONE)
                .toString()}M)`}
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
