// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  emptyView?: React.ReactNode;
}

export const SidePanel = ({ children, className, header, emptyView = '' }: Props) => {
  return (
    <div
      className={classes('mb-8 border rounded-md border-gray-200 dark:border-gray-700', className)}
    >
      <div className="text-sm rounded-t-md border-b dark:text-gray-300 text-gray-600 border-gray-200 dark:border-gray-700 dark:bg-elevation-1 p-4">
        {header}
      </div>
      <div>
        {children}
        {(!children || (children as unknown[]).length === 0) && (
          <p className="p-4 text-gray-400 text-xs">{emptyView || ''}</p>
        )}
      </div>
    </div>
  );
};
