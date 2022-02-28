// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';
import type { Validation } from 'types';
import { classes } from 'ui/util';

type ValidationState = 'error' | 'success' | 'warning' | null;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
}

export function getValidation({
  isError,
  isSuccess,
  isValid,
  isWarning,
  message,
}: Validation): Validation {
  return { isError, isSuccess, isValid, isWarning, message };
}

export function FormField({
  children,
  className,
  id,
  isError,
  isSuccess,
  isWarning,
  label,
  message,
}: Props & Validation) {
  const validationState = useMemo((): ValidationState => {
    if (!message) return null;

    if (isError) return 'error';
    if (isWarning) return 'warning';
    if (isSuccess) return 'success';

    return null;
  }, [isError, isSuccess, isWarning, message]);

  return (
    <div className={classes('form-field', className)}>
      {label && (
        <label
          className="block mb-1.5 text-sm font-semibold dark:text-white text-gray-600"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {children}
      {message && validationState && (
        <div className={classes('validation', validationState && validationState)}>
          {['error', 'warning'].includes(validationState) && <ExclamationCircleIcon />}
          {validationState === 'success' && <CheckCircleIcon />}
          {message}
        </div>
      )}
    </div>
  );
}

export function Form({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classes('mb-10', className)} {...props}>
      {children}
    </div>
  );
}
