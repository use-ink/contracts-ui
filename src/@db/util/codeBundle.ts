// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { nanoid } from 'nanoid';

export function getNewCodeBundleId(): string {
  return nanoid(8);
}