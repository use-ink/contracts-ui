// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import type { Circle } from '@polkadot/ui-shared/icons/types';
import React, { useCallback } from 'react';
import { polkadotIcon } from '@polkadot/ui-shared';
import { classes } from 'ui/util';
import { useNotifications } from 'ui/contexts';

export interface Props extends React.HTMLAttributes<HTMLImageElement> {
  value?: string | null;
  isAlternative?: boolean;
  size: number;
}

function renderCircle({ cx, cy, fill, r }: Circle, key: number): React.ReactNode {
  return <circle cx={cx} cy={cy} fill={fill} key={key} r={r} />;
}

function IdenticonBase({
  value = '',
  className = '',
  isAlternative = false,
  size,
  style,
}: Props): React.ReactElement<Props> | null {
  const { notify } = useNotifications();
  const onClick = useCallback(() => {
    if (value) {
      copy(value);
      notify({ type: 'copied', value });
    }
  }, [notify, value]);

  try {
    return (
      <svg
        className={classes('cursor-help', className)}
        height={size}
        id={value || undefined}
        name={value || undefined}
        onClick={onClick}
        style={style}
        viewBox="0 0 64 64"
        width={size}
      >
        {polkadotIcon(value || '', { isAlternative }).map(renderCircle)}
      </svg>
    );
  } catch (e) {
    return null;
  }
}

export const Identicon = React.memo(IdenticonBase);
