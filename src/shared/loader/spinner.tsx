// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from '~/lib/util';

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
      className={classes(
        `w-${width} h-${width}`,
        `border-${strokeWidth}`,
        `border-${color}`,
        `dark:border-${darkColor}`,
        'animate-spin rounded-full border-solid',
        className,
      )}
      data-cy="spinner"
      style={{ borderTopColor: 'transparent' }}
    />
  );
}
