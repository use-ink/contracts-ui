import React from 'react';
import { classes } from 'ui/util';

type Variant = 'default' | 'primary' | 'plain' | 'negative';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  variant?: Variant
}

export function Buttons ({ children, className }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <div
      className={classes('flex space-x-2', className)}
    >
      {children}
    </div>
  )
}

export function Button ({ children, className = '', isDisabled = false, variant = 'default', ...props }: Props) {
  return (
    <button
      type="button"
      className={classes('btn', variant, className)}
      {...isDisabled ? { disabled: true } : {}}
      {...props}
    >
      {children}
    </button>
  )
};