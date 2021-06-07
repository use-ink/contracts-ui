import { ApiPromise, Keyring } from './substrate';

export interface AppState {
  socket: string;
  keyring: Keyring | null;
  keyringState: string | null;
  api: ApiPromise | null;
  apiError: unknown;
  apiState: string | null;
}

export type Action =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_SUCCESS' }
  | { type: 'CONNECT_ERROR'; payload: unknown }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_KEYRING'; payload: Keyring }
  | { type: 'KEYRING_ERROR' };
