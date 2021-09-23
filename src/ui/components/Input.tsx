import React from 'react';
import { SimpleSpread } from 'types';
import { classes } from 'ui/util';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    isDisabled?: boolean;
    isError?: boolean;
    onChange: (_: string) => void,
    value?: string | null
  }
>

export function Input ({ children, className, isDisabled = false, isError = false, onChange: _onChange, value, ...props }: Props) {
  function onChange (e: React.ChangeEvent<HTMLInputElement>): void {
    _onChange(e.target.value);
  }

  return (
    <div className={classes(isError && 'isError', className)}>
      <input
        onChange={onChange}
        type="text"
        value={value || ''}
        className="w-full dark:bg-gray-900 dark:text-gray-300 bg-white dark:border-gray-700 border-gray-200 rounded text-sm"
        {...(isDisabled ? { disabled: true } : {})}
        {...props}
      />
      {children}
    </div>
  );
};
