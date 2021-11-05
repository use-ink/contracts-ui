// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  strokeWidth?: number;
  width?: number;
  color?: string;
  darkColor?: string;
}

export function Spinner({
  className,
  color = 'blue-500',
  darkColor = color,
  strokeWidth = 4,
  width = 16,
}: Props) {
  return (
    <div
      style={{ borderTopColor: 'transparent' }}
      className={classes(
        `w-${width} h-${width}`,
        `border-${strokeWidth}`,
        `border-${color}`,
        `dark:border-${darkColor}`,
        'border-solid rounded-full animate-spin',
        className
      )}
    />
  );
}
