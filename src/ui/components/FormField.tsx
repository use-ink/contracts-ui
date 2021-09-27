import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';
import type { Validation } from 'types';
import { classes } from 'ui/util';

type ValidationState = 'error' | 'success' | 'warning' | null;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  validation?: React.ReactNode;
}

export function getValidation ({ isError, isSuccess, isValid, isWarning, validation }: Validation): Validation {
  return { isError, isSuccess, isValid, isWarning, validation };
}

export function FormField ({ children, className, id, isError, isSuccess, isWarning, label, validation }: Props & Validation) {
  const validationState = useMemo(
    (): ValidationState => {
      if (!validation) return null;

      if (isError) return 'error';
      if (isWarning) return 'warning';
      if (isSuccess) return 'success';
  
      return null;
    },
    [isError, validation]
  )

  return (
    <div className={classes('form-field', className)}>
      {label && (
        <label
          className="block mb-1.5 text-sm font-semibold dark:text-white"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {children}
      {validation && validationState && (
        <div className={classes('validation', validationState && validationState)}>
          {['error', 'warning'].includes(validationState) && (
            <ExclamationCircleIcon />
          )}
          {validationState === 'success' && (
            <CheckCircleIcon />
          )}
          {validation}
        </div>
      )}
    </div>
  )
}

export function Form ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classes('mb-10', className)} {...props}>
      {children}
    </div>
  );
}