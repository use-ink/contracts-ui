// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HTMLAttributes } from 'react';
import { useMemo } from 'react';
import { UnsupportedBrowserMessage } from './common/UnsupportedBrowserMessage';

export function CheckBrowserSupport({
  children,
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const isSafari = useMemo(() => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }, []);

  if (isSafari) {
    return <UnsupportedBrowserMessage />;
  } else {
    return <>{children}</>;
  }
}
