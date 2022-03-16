// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { nanoid } from 'nanoid';

export function getNewCodeBundleId(): string {
  return nanoid(8);
}
