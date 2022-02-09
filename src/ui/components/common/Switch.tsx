// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { HTMLAttributes } from 'react';
import { Switch as HUISwitch } from '@headlessui/react';
import { classes } from 'ui/util';
import { SimpleSpread } from 'types';

type Props = SimpleSpread<
  HTMLAttributes<HTMLDivElement>,
  {
    value: boolean;
    onChange: (_: boolean) => void;
  }
>;

export function Switch({ children, className, onChange, value }: Props) {
  return (
    <HUISwitch
      checked={value}
      className={classes(
        value ? 'bg-indigo-500' : 'bg-gray-700',
        'relative inline-flex flex-shrink-0 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
        className
      )}
      onChange={onChange}
    >
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className={classes(
          value ? 'translate-x-3.5' : 'translate-x-0',
          'pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </HUISwitch>
  );
}
