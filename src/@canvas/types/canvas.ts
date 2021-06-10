// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import type { ApiPromise } from '@polkadot/api';
import type { Keyring } from '@polkadot/ui-keyring';

export interface CanvasState {
  blockOneHash: string | null;
  endpoint: string;
  keyring: Keyring | null;
  keyringStatus: string | null;
  api: ApiPromise | null;
  error: unknown | null;
  status: string | null;
}

export type CanvasAction =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_SUCCESS' }
  | { type: 'CONNECT_READY'; payload: string }
  | { type: 'CONNECT_ERROR'; payload: unknown }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_ENDPOINT'; payload: string }
  | { type: 'SET_KEYRING'; payload: Keyring }
  | { type: 'KEYRING_ERROR' };
