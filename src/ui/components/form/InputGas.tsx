// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { BN_MILLION, BN_ONE, isUndefined } from '@polkadot/util';
import { InputNumber } from './InputNumber';
import type { BN, UseWeight } from 'types';
import { classes } from 'ui/util';

interface Props extends UseWeight, React.HTMLAttributes<HTMLDivElement> {
  estimatedWeight?: BN;
}

function estimatedMegaGas(estimatedWeight: BN): BN {
  return estimatedWeight.div(BN_MILLION).iadd(BN_ONE);
}

export function InputGas({
  className,
  estimatedWeight,
  executionTime,
  megaGas,
  percentage,
  setMegaGas,
  weight,
  ...props
}: Props) {
  const isUsingEstimate = useEffect((): void => {
    !isUndefined(estimatedWeight) &&
      isUsingEstimate &&
      setMegaGas(estimatedMegaGas(estimatedWeight));
  }, [estimatedWeight, setMegaGas]);

  return (
    <div className={classes(className)} {...props}>
      <InputNumber value={megaGas} onChange={setMegaGas} placeholder="200000" />
      <div className="relative pt-2">
        <div className="text-gray-500 text-xs pb-2">
          {executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3)}s execution time (
          {percentage}% of block time)
          {estimatedWeight && weight !== estimatedWeight && (
            <a
              className="float-right"
              onClick={e => {
                e.preventDefault();

                setMegaGas(estimatedMegaGas(estimatedWeight));
              }}
            >
              Use Estimated Weight ({estimatedWeight.toString()})
            </a>
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
