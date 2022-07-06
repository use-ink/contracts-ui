// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  nestingNumber: number;
}

export function SubForm({ children, className, nestingNumber }: Props) {
  const isOddNesting = nestingNumber % 2 != 0;

  return (
    <div
      className={classes(
        'p-4 text-left text-sm rounded border dark:border-gray-500 border-gray-200',
        isOddNesting ? 'dark:bg-gray-900 bg-white' : 'dark:bg-elevation-1 bg-gray-100',
        className
      )}
    >
      {children}
    </div>
  );
}
