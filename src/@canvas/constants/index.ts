// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import type { CanvasState } from '../types';

export const LOCAL_NODE = 'ws://127.0.0.1:9944';

export const INIT_STATE: CanvasState = {
  blockOneHash: null,
  endpoint: LOCAL_NODE,
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
};
