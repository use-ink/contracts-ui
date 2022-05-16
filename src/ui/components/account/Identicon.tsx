// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactTooltip from 'react-tooltip';
import copy from 'copy-to-clipboard';
import type { Circle } from '@polkadot/ui-shared/icons/types';
import React, { useCallback, useRef } from 'react';
import { polkadotIcon } from '@polkadot/ui-shared';
import { classes } from 'ui/util';

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
  const ref = useRef<SVGSVGElement>(null);

  const onClick = useCallback(() => {
    if (value) {
      copy(value);
    }
  }, [value]);

  const tooltipId = `identicon-copied-${value}`;

  try {
    return (
      <>
        <svg
          className={classes('cursor-copy', className)}
          data-tip
          data-for={tooltipId}
          data-event="click"
          height={size}
          id={value ? `identicon-${value}` : undefined}
          name={value || undefined}
          onClick={onClick}
          ref={ref}
          style={{ ...style, zIndex: 999 }}
          viewBox="0 0 64 64"
          width={size}
        >
          {polkadotIcon(value || '', { isAlternative }).map(renderCircle)}
        </svg>
        <ReactTooltip
          afterShow={() => {
            setTimeout(() => ref.current && ReactTooltip.hide(ref.current), 3000);
          }}
          id={tooltipId}
        >
          Copied to clipboard
        </ReactTooltip>
      </>
    );
  } catch (e) {
    return null;
  }
}

export const Identicon = React.memo(IdenticonBase);
