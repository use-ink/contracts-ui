// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { XIcon } from '@heroicons/react/solid';
import { VoidFn } from 'types';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<unknown> {
  icon: React.ReactNode;
  isDismissable?: boolean;
  label?: React.ReactNode;
  onDismiss: VoidFn;
  text?: React.ReactNode;
}

export function Notification({
  className,
  icon,
  isDismissable,
  label,
  onDismiss,
  text,
  ...props
}: Props) {
  return (
    <div
      data-cy={(props as Record<string, unknown>)['data-cy']}
      className={classes(
        'max-w-full dark:bg-elevation-3 dark:text-white bg-gray-200 text-gray-600 p-3 mb-3 flex items-center',
        className
      )}
    >
      {icon}
      <div className="pl-2 flex-grow text-sm">
        <div>{label}</div>
        {text && <div className="text-gray-400">{text}</div>}
      </div>
      {isDismissable && (
        <XIcon className="text-gray-400 w-4 h-4 cursor-pointer" onClick={onDismiss} />
      )}
    </div>
  );
}
