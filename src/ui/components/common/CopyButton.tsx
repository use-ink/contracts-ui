// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import React, { useCallback } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { Button } from './Button';
import { classes } from 'ui/util';
import { useNotifications } from 'ui/contexts';

interface Props extends React.HTMLAttributes<unknown> {
  iconClassName?: string;
  value: string;
}

export function CopyButton({ className, iconClassName, value }: Props) {
  const { notify } = useNotifications();
  const onClick = useCallback((): void => {
    copy(value);
    notify({
      type: 'copied',
      value,
    });
  }, [notify, value]);

  const id = `copyButton-${value}`;

  return (
    <Button
      className={classes('', className)}
      data-for={id}
      data-tip
      onClick={onClick}
      variant="plain"
    >
      <DocumentDuplicateIcon
        className={classes('w-4 h-4 hover:text-gray-600 dark:hover:text-gray-300', iconClassName)}
      />
    </Button>
  );
}
