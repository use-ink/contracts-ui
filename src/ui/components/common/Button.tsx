// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { classes } from 'ui/util';

type Variant = 'default' | 'primary' | 'plain' | 'negative';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: Variant;
}

export function Buttons({ children, className }: React.HTMLAttributes<HTMLButtonElement>) {
  return <div className={classes('flex space-x-2', className)}>{children}</div>;
}

export function Button({
  children,
  className = '',
  isDisabled = false,
  isLoading,
  variant = 'default',
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={classes('btn relative', variant, className)}
      {...(isDisabled || isLoading ? { disabled: true } : {})}
      {...props}
    >
      {isLoading && (
        <div
          style={{
            borderTopColor: 'transparent',
            left: 'calc(50% - 7px)',
          }}
          className="w-3.5 h-3.5 absolute border dark:border-white border-solid rounded-full animate-spin"
        />
      )}
      <div className={classes('flex', isLoading ? 'invisible' : '')}>{children}</div>
    </button>
  );
}
