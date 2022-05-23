// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import React, { useCallback, useRef } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';
import { Button } from './Button';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<unknown> {
  iconClassName?: string;
  value: string;
}

export function CopyButton({ className, iconClassName, value }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const onClick = useCallback((): void => {
    copy(value);

    ref.current && ReactTooltip.show(ref.current);
  }, [value]);

  const id = `copyButton-${value}`;

  return (
    <>
      <Button
        className={classes('', className)}
        data-for={id}
        data-tip
        onClick={onClick}
        ref={ref}
        variant="plain"
      >
        <DocumentDuplicateIcon
          className={classes('w-4 h-4 hover:text-gray-600 dark:hover:text-gray-300', iconClassName)}
        />
      </Button>
      <ReactTooltip
        afterShow={() => setTimeout(() => ref.current && ReactTooltip.hide(ref.current), 1000)}
        id={id}
        event="none"
      >
        Copied to clipboard
      </ReactTooltip>
    </>
  );
}
