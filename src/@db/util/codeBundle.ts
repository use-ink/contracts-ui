// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { nanoid } from 'nanoid';

export function getNewCodeBundleId(): string {
  return nanoid(8);
}