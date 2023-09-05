// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { classes } from 'lib/util';

type Variant = 'default' | 'primary' | 'plain' | 'negative';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  isLoading?: boolean;
  ref?: React.MutableRefObject<HTMLButtonElement | null>;
  variant?: Variant;
}

export function Buttons({ children, className }: React.HTMLAttributes<HTMLButtonElement>) {
  return <div className={classes('flex space-x-2', className)}>{children}</div>;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { children, variant, className, isDisabled, isLoading, ...rest } = props;

  return (
    <button
      className={classes('btn relative', variant, className)}
      ref={ref}
      type="button"
      {...(isDisabled || isLoading ? { disabled: true } : {})}
      {...rest}
    >
      {isLoading && (
        <div
          className="absolute h-3.5 w-3.5 animate-spin rounded-full border border-solid dark:border-white"
          style={{
            borderTopColor: 'transparent',
            left: 'calc(50% - 7px)',
          }}
        />
      )}
      <div className={classes('flex', isLoading ? 'invisible' : '')}>{children}</div>
    </button>
  );
});
