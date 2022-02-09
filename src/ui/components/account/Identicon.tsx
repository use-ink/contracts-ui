// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Circle } from '@polkadot/ui-shared/icons/types';

import React from 'react';

import { polkadotIcon } from '@polkadot/ui-shared';

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
  try {
    return (
      <svg
        className={className}
        height={size}
        id={value || undefined}
        name={value || undefined}
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
