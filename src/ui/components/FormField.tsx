import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import React, { HTMLAttributes, useMemo } from 'react';
import { Validation } from 'ui/hooks/useFormField';
import { classes } from 'ui/util';

type ValidationState = 'error' | 'success' | 'warning' | null;

interface Props extends HTMLAttributes<HTMLDivElement> {
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
    <div className={classes('form-field', 'mb-5 last-of-type:mb-0', className)}>
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

// export function Form ({ children, className }: HTMLAttributes<HTMLDivElement>) {
//   return (
//     <div className={classes('last:mb-0', className)}>
//       {children}
//     </div>
//   )
// }