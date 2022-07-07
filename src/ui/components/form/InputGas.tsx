// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN_MILLION, BN_ONE, BN_ZERO } from '@polkadot/util';
import { Meter } from '../common/Meter';
import { InputNumber } from './InputNumber';
import type { UseWeight } from 'types';
import { classes } from 'ui/util';

interface Props extends UseWeight, React.HTMLAttributes<HTMLDivElement> {
  isCall?: boolean;
  withEstimate?: boolean;
}

export function InputGas({
  className,
  defaultWeight,
  estimatedWeight,
  executionTime,
  isActive,
  isCall,
  isValid,
  megaGas,
  percentage,
  setIsActive,
  setMegaGas,
  weight,
  withEstimate,
  ...props
}: Props) {
  return (
    <div className={classes(className)} {...props}>
      <InputNumber
        value={megaGas}
        isDisabled={!isActive}
        onChange={value => {
          if (isActive) {
            setMegaGas(value);
          }
        }}
        placeholder="MGas"
        data-cy="gas-input"
      />
      <Meter
        accessory={
          isActive ? (
            <a
              href="#"
              onClick={e => {
                e.preventDefault();

                setIsActive(false);
              }}
              data-cy="use-estimated-gas"
              className="text-green-500"
            >
              {isCall
                ? `Use Estimated Gas (${(estimatedWeight || BN_ZERO)
                    .div(BN_MILLION)
                    .add(BN_ONE)
                    .toString()}M)`
                : 'Use Maximum Query Gas'}
            </a>
          ) : (
            <>
              {isCall ? 'Using Estimated Gas' : 'Using Maximum Query Gas'}
              &nbsp;{' · '}&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();

                  setIsActive(true);
                }}
                className="text-green-500"
                data-cy="use-custom-gas"
              >
                Use Custom
              </a>
            </>
          )
        }
        label={`${
          executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3)
        }s execution time (${percentage.toFixed(2)}% of block time)}`}
        percentage={percentage}
        withAccessory={withEstimate}
      />
    </div>
  );
}
