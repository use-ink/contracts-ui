// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BN_MILLION, BN_ZERO } from '@polkadot/util';
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
  const { t } = useTranslation();

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
              className="text-green-500"
            >
              {isCall
                ? t('useEstimatedWeight', 'Use Estimated Weight ({{estimatedWeight}}M)', {
                    replace: {
                      estimatedWeight: (estimatedWeight || BN_ZERO).div(BN_MILLION).toString(),
                    },
                  })
                : t('useMaximumQueryGas', 'Use Maximum Query Gas')}
            </a>
          ) : (
            <>
              {isCall
                ? t('usingEstimatedGas', 'Using Estimated Gas')
                : t('usingMaximumQueryGas', 'Using Maximum Query Gas')}
              &nbsp;{' · '}&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();

                  setIsActive(true);
                }}
                className="text-green-500"
              >
                {t('useCustomWeight', 'Use Custom')}
              </a>
            </>
          )
        }
        label={t(
          'inputGasExecutionTime',
          '{{executionTime}}s execution time ({{percentage}}% of block time)',
          {
            replace: {
              executionTime: executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3),
              percentage: percentage.toFixed(2),
            },
          }
        )}
        percentage={percentage}
        withAccessory={withEstimate}
      />
    </div>
  );
}
