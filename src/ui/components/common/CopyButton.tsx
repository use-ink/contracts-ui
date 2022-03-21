// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import React, { useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { Button } from './Button';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<unknown> {
  iconClassName?: string;
  value: string;
}

export function CopyButton({ className, iconClassName, value }: Props) {
  const onClick = useCallback((): void => {
    copy(value);

    setTimeout((): void => {
      ReactTooltip.hide();
    }, 3000);
  }, [value]);

  const id = `copyButton-${value}`;

  return (
    <>
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
      <ReactTooltip
        className="font-sans text-xs"
        delayHide={3000}
        afterShow={onClick}
        event="click"
        id={id}
      >
        Copied to clipboard
      </ReactTooltip>
    </>
  );
}
