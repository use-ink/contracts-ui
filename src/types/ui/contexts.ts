// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Struct } from '@polkadot/types';
import { AccountId, ContractExecResult } from '@polkadot/types/interfaces';
import type {
  Abi,
  ApiPromise,
  BlueprintPromise,
  BlueprintSubmittableResult,
  CodeSubmittableResult,
  ContractPromise,
  Keyring,
  SubmittableExtrinsic,
  SubmittableResult,
  VoidFn,
} from '../substrate';
// import type { UseFormField, UseStepper, UseToggle, UseWeight } from './hooks';
import type { BN } from './util';

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

export interface InstantiateReturnValue extends Struct {
  readonly result: ContractExecResult;
  readonly accountId: AccountId;
}

export interface ApiState extends ChainProperties {
  endpoint: string;
  keyring: Keyring;
  keyringStatus: string | null;
  api: ApiPromise;
  error: unknown | null;
  status: Status;
}

export type ApiAction =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_READY'; payload: Partial<ChainProperties> }
  | { type: 'CONNECT_ERROR'; payload: unknown }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_ENDPOINT'; payload: string }
  | { type: 'SET_KEYRING'; payload: Keyring }
  | { type: 'KEYRING_ERROR' };

export interface ChainProperties {
  blockOneHash: string | null;
  tokenDecimals: number;
  systemName: string | null;
  systemVersion: string | null;
  tokenSymbol: string;
}

export type OnInstantiateSuccess$Code = (_: CodeSubmittableResult<'promise'>) => Promise<void>;
export type OnInstantiateSuccess$Hash = (_: BlueprintSubmittableResult<'promise'>) => Promise<void>;

export interface InstantiateData {
  accountId?: string;
  argValues?: Record<string, unknown>;
  value: BN;
  metadata?: Abi;
  name: string;
  constructorIndex: number;
  salt?: string;
  storageDepositLimit?: BN | null;
  weight: BN;
  codeHash?: string;
}
export interface InstantiateState {
  data: InstantiateData;
  dryRunResult?: InstantiateReturnValue;
  setData?: React.Dispatch<React.SetStateAction<InstantiateData>>;
  onError: () => void;
  onFinalize?: (data: Partial<InstantiateData>) => void;
  onFormChange: (data: Partial<InstantiateData>) => void;
  onUnFinalize?: () => void;
  onSuccess: (_: ContractPromise, __?: BlueprintPromise | undefined) => void;
  onInstantiate: OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash;
  currentStep: number;
  stepForward?: VoidFn;
  stepBackward?: VoidFn;
  setStep?: React.Dispatch<number>;
  tx: SubmittableExtrinsic<'promise'> | null;
}

export type InstantiateProps = InstantiateState;

export enum TxStatus {
  Error = 'error',
  Success = 'success',
  Processing = 'processing',
  Queued = 'queued',
}
export interface TxOptions {
  extrinsic: SubmittableExtrinsic<'promise'>;
  accountId: string;
  isValid: (_: SubmittableResult) => boolean;
  onSuccess?: ((_: SubmittableResult) => void) | ((_: SubmittableResult) => Promise<void>);
  onError?: () => void;
}

export interface QueuedTxOptions extends TxOptions {
  status: TxStatus;
  events: Record<string, number>;
}
export interface TransactionsQueue {
  [id: number]: QueuedTxOptions | undefined;
}

export interface TransactionsState {
  txs: TransactionsQueue;
  process: (_: number) => Promise<void>;
  queue: (_: TxOptions) => number;
  dismiss: (id: number) => void;
}
