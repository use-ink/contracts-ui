// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { InformationCircleIcon } from '@heroicons/react/solid';
import { classes } from 'lib/util';

type Props = React.HTMLProps<HTMLDivElement>;

export function Info({ children, className }: Props) {
  return (
    <div className={classes('page-error', className)} data-cy="error-card">
      <div>
        <InformationCircleIcon className="mb-1 h-10 w-10 text-blue-400" />
        {children}
      </div>
    </div>
  );
}
