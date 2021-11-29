// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { BN_MILLION, BN_ZERO } from '@polkadot/util';
import { InputNumber } from './InputNumber';
import type { ApiPromise, BN, OrFalsy, UseWeight } from 'types';
import { classes } from 'ui/util';
import { maximumBlockWeight } from 'api';
import { useApi } from 'ui/contexts';

interface Props extends UseWeight, React.HTMLAttributes<HTMLDivElement> {
  estimatedWeight?: BN | null;
  isCall?: boolean;
  withEstimate?: boolean;
}

function estimatedMegaGas(api: ApiPromise, estimatedWeight: OrFalsy<BN>, withBuffer = true): BN {
  return (estimatedWeight || maximumBlockWeight(api)).div(BN_MILLION).addn(withBuffer ? 1 : 0);
}

export function InputGas({
  className,
  estimatedWeight,
  executionTime,
  isCall,
  isEmpty,
  megaGas,
  percentage,
  setIsEmpty,
  setMegaGas,
  weight,
  withEstimate,
  ...props
}: Props) {
  const { api } = useApi();
  useEffect((): void => {
    setIsEmpty(true);

    setMegaGas(estimatedMegaGas(api, estimatedWeight, !!estimatedWeight));
  }, [api, estimatedWeight, setIsEmpty, setMegaGas]);

  return (
    <div className={classes(className)} {...props}>
      <InputNumber value={megaGas} isDisabled={isEmpty} onChange={setMegaGas} placeholder="MGas" />
      <div className="relative pt-2">
        <div className="text-gray-500 text-xs pb-2">
          {executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3)}s execution time (
          {percentage.toFixed(2)}% of block time)
          {withEstimate && (
            <div className="float-right">
              {isEmpty ? (
                <>
                  {isCall ? 'Using Estimated Gas' : 'Using Maximum Query Gas'}
                  {' · '}
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();

                      setIsEmpty(false);
                    }}
                  >
                    Use Custom
                  </a>
                </>
              ) : (
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();

                    setMegaGas(estimatedMegaGas(api, estimatedWeight, !!estimatedWeight));
                    setIsEmpty(true);
                  }}
                >
                  {isCall
                    ? `Use Estimated Weight (${(estimatedWeight || BN_ZERO)
                        .div(BN_MILLION)
                        .toString()}M)`
                    : 'Use Maximum Query Gas'}
                </a>
              )}
            </div>
          )}
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-400"
          ></div>
        </div>
      </div>
    </div>
  );
}
