// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import BN from 'bn.js';
import { Meter } from '../common/Meter';
import { InputNumber } from './InputNumber';
import { UIGas } from 'types';
import { BN_ZERO } from 'helpers';
import { MAX_CALL_WEIGHT } from 'src/constants';

export function InputRefTime({
  estimation,
  setLimit,
  mode,
  setMode,
  setErrorMsg,
  setIsValid,
  limit,
}: UIGas & { estimation: BN | undefined }) {
  const [displayValue, setDisplayValue] = useState(limit.toString() ?? '0');

  useEffect(() => {
    if (mode === 'estimation' && estimation) {
      setDisplayValue(estimation.toString());
      if (limit.eq(BN_ZERO)) setLimit(estimation);
    }
  }, [estimation, limit, mode, setLimit]);

  return (
    <div>
      <InputNumber
        value={displayValue}
        disabled={mode === 'estimation'}
        onChange={e => {
          if (mode === 'custom') {
            const bn = new BN(e.target.value);
            if (bn.lte(MAX_CALL_WEIGHT)) {
              setDisplayValue(e.target.value);
              setLimit(bn);
              setErrorMsg('');
              setIsValid(true);
            } else {
              setErrorMsg('Value exceeds maximum block weight');
              setIsValid(false);
            }
          }
        }}
        placeholder="MGas"
        data-cy="refTime-input"
        min="0"
        className="disabled:opacity-60"
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
              data-cy="use-estimated-refTime"
              className="text-green-500"
            >
              Use Estimated RefTime
            </a>
          ) : (
            <>
              {'Using Estimated RefTime'}
              &nbsp;{' · '}&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMode('custom');
                  estimation && setLimit(estimation);
                }}
                className="text-green-500"
                data-cy="use-custom-refTime"
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
