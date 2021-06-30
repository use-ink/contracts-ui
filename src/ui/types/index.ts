// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { ApiPromise } from '@polkadot/api';
import type { Keyring } from '@polkadot/ui-keyring';
import type { Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';

export type VoidFn = () => void;

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

export interface DbProps {
  db: Database;
  identity: PrivateKey | null;
  isDbReady: boolean;
}
