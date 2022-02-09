// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import { classes } from 'ui/util';
import { useInstantiate } from 'ui/contexts';

type Step = { name: string; index: number };

interface Props {
  steps: Step[];
}

export function Stepper({ steps }: Props) {
  const { currentStep } = useInstantiate();
  return (
    <>
      {steps.map(({ name, index }) => {
        const isFilled = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={`${name}`}>
            {index > 1 ? (
              <div className="flex justify-center w-6 py-4">
                <span
                  className={`h-8 ${isFilled ? 'bg-indigo-500' : 'bg-elevation-2'}`}
                  style={{ width: '2px' }}
                ></span>
              </div>
            ) : null}
            <div className="flex space-x-4 items-center">
              <div
                className={classes(
                  isFilled ? 'bg-indigo-500' : 'bg-elevation-2',
                  'flex items-center justify-center text-white text-center text-sm rounded-md w-6 h-6 p-1'
                )}
              >
                {index < currentStep ? (
                  <CheckIcon className="bg-indigo-500 text-white text-lg rounded-md w-6" />
                ) : (
                  index
                )}
              </div>
              <span className={classes('text-sm', isCurrent ? 'text-gray-200' : 'text-gray-500')}>
                {name}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
