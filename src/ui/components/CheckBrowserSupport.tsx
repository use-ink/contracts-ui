// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { UnsupportedBrowserMessage } from './common/UnsupportedBrowserMessage';

export function CheckBrowserSupport({
  children,
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const isSafari = useMemo(() => {
    return navigator.userAgent.indexOf('Safari') > 0;
  }, []);

  if (isSafari) {
    return <UnsupportedBrowserMessage />;
  } else {
    return <>{children}</>;
  }
}
