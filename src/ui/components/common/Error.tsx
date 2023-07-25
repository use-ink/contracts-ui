// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { classes } from 'helpers';

export function Error({ children, className }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div className={classes('page-error', className)} data-cy="error-card">
      <div>
        <ExclamationCircleIcon className="mb-1 h-10 w-10 text-red-400" />
        {children}
      </div>
    </div>
  );
}
