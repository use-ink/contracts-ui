// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch as HUISwitch } from '@headlessui/react';
import { classes } from 'helpers';
import { SimpleSpread } from 'types';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
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
        value ? 'bg-green-500' : 'bg-gray-700',
        'relative inline-flex w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
        className,
      )}
      data-cy="switch-button"
      onChange={onChange}
    >
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className={classes(
          value ? 'translate-x-3.5' : 'translate-x-0',
          'pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
        )}
      />
    </HUISwitch>
  );
}
