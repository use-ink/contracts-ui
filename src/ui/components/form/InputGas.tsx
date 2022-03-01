// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import { BN_MILLION, BN_ONE, BN_ZERO } from '@polkadot/util';
import { Meter } from '../common/Meter';
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
  isValid,
  megaGas,
  percentage,
  setIsEmpty,
  setMegaGas,
  weight,
  withEstimate,
  ...props
}: Props) {
  const { api } = useApi();
  const estimatedWeightRef = useRef(estimatedWeight);
  useEffect((): void => {
    if (
      estimatedWeight &&
      withEstimate &&
      (!estimatedWeightRef.current || !estimatedWeight.eq(estimatedWeightRef.current))
    ) {
      setIsEmpty(true);

      setMegaGas(estimatedMegaGas(api, estimatedWeight, !!estimatedWeight));

      estimatedWeightRef.current = estimatedWeight;
    }
  }, [api, estimatedWeight, withEstimate, setIsEmpty, setMegaGas]);

  return (
    <div className={classes(className)} {...props}>
      <InputNumber value={megaGas} isDisabled={isEmpty} onChange={setMegaGas} placeholder="MGas" />
      <Meter
        accessory={isEmpty ? (
          <>
            {isCall ? 'Using Estimated Gas' : 'Using Maximum Query Gas'}
            &nbsp;{' · '}&nbsp;
            <a
              href="#"
              onClick={e => {
                e.preventDefault();

                setIsEmpty(false);
              }}
              className="text-blue-500"
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
            className="text-blue-500"
          >
            {isCall
              ? `Use Estimated Gas (${(estimatedWeight || BN_ZERO)
                  .div(BN_MILLION)
                  .add(BN_ONE)
                  .toString()}M)`
              : 'Use Maximum Query Gas'}
          </a>
        )}
        label={`${executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3)}s execution time (${percentage.toFixed(2)}% of block time)}`}
        percentage={percentage}
        withAccessory={withEstimate}
      />
    </div>
  );
}
