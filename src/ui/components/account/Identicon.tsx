// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { polkadotIcon } from '@polkadot/ui-shared';
import type { Circle } from '@polkadot/ui-shared/icons/types';
import copy from 'copy-to-clipboard';
import React, { useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { Button } from '../common';
import { classes } from 'helpers';

export interface IdenticonBaseProps extends React.HTMLAttributes<HTMLImageElement> {
  value?: string | null;
  isAlternative?: boolean;
  size: number;
}

function renderCircle({ cx, cy, fill, r }: Circle, key: number) {
  return <circle cx={cx} cy={cy} fill={fill} key={key} r={r} />;
}

function IdenticonBase({
  value = '',
  className = '',
  isAlternative = false,
  size,
  style,
}: IdenticonBaseProps) {
  const onClick = useCallback(() => {
    if (value) {
      copy(value);
    }
  }, [value]);

  const tooltipId = `identicon-copied-${value}`;

  try {
    return (
      <>
        <Button
          data-cy="identicon"
          data-tip
          data-tooltip-id={tooltipId}
          onClick={onClick}
          variant="plain"
        >
          <svg
            className={classes('cursor-copy', className)}
            height={size}
            id={value ? `identicon-${value}` : undefined}
            name={value || undefined}
            style={{ ...style, zIndex: 999 }}
            viewBox="0 0 64 64"
            width={size}
          >
            {polkadotIcon(value || '', { isAlternative }).map(renderCircle)}
          </svg>
        </Button>
        <Tooltip id={tooltipId} openOnClick>
          Copied to clipboard
        </Tooltip>
      </>
    );
  } catch (e) {
    return null;
  }
}

export const Identicon = React.memo(IdenticonBase);
