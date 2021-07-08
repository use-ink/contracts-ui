// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { ApiPromise } from '@polkadot/api';
import type { Keyring } from '@polkadot/ui-keyring';
import type { Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';
import { ContractPromise, Abi, EventRecord, DispatchError } from '../../canvas/types';
import { UserDocument } from '@db/types';

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
  user: UserDocument | null;
  identity: PrivateKey | null;
  isDbReady: boolean;
}
export type DropdownOption = {
  value: string | number;
  name: string;
};
export interface InstantiateState {
  isLoading: boolean;
  isSuccess: boolean;
  currentStep: number;
  fromAddress?: string;
  fromAccountName?: string;
  codeHash?: string;
  metadata?: Abi;
  constructorName?: string;
  argValues?: Record<string, string>;
  contract?: ContractPromise | null;
  events?: EventRecord[];
  error?: DispatchError;
  contractName: string;
}

export type InstantiateAction =
  | { type: 'INSTANTIATE' }
  | { type: 'INSTANTIATE_FINALIZED'; payload: EventRecord[] }
  | { type: 'INSTANTIATE_SUCCESS'; payload: ContractPromise }
  | { type: 'INSTANTIATE_ERROR'; payload: DispatchError }
  | { type: 'STEP_1_COMPLETE'; payload: { codeHash: string; metadata: Abi; contractName: string } }
  | {
      type: 'STEP_2_COMPLETE';
      payload: { fromAddress: string; fromAccountName: string; contractName: string };
    }
  | {
      type: 'STEP_3_COMPLETE';
      payload: { constructorName: string; argValues: Record<string, string> };
    }
  | {
      type: 'GO_TO';
      payload: { step: number };
    };
