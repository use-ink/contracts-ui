// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { nanoid } from 'nanoid';

export function getNewCodeBundleId(): string {
  return nanoid(8);
}
