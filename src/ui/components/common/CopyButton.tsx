// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import Select, {
  components,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  InputProps,
  OptionProps,
  Props as ReactSelectProps,
} from 'react-select';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { classes } from 'ui/util';
import type { DropdownOption, DropdownProps } from 'types';
import { useToggle } from 'ui/hooks/useToggle';
import { Button } from '.';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';

interface Props extends React.HTMLAttributes<unknown> {
  value: string;
}

export function CopyButton({ className, value }: Props) {
  const [isShowingTooltip, , setIsShowingTooltip] = useToggle();

  const onClick = useCallback((): void => {
    copy(value);

    setIsShowingTooltip(true);
    setTimeout((): void => {
      setIsShowingTooltip(false);
    }, 5000);
  }, [setIsShowingTooltip, value]);

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
        <ClipboardCopyIcon />
      </Button>
      <ReactTooltip id={id}>Copied to clipboard</ReactTooltip>
    </>
  );
}
