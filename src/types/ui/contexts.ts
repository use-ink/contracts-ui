// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  AbiConstructor,
  ApiPromise,
  BlueprintPromise,
  BlueprintSubmittableResult,
  CodeSubmittableResult,
  ContractPromise,
  Keyring,
  SubmittableExtrinsic,
  SubmittableResult,
} from '../substrate';
import type {
  UseBalance,
  UseFormField,
  UseMetadata,
  UseStepper,
  UseToggle,
  UseWeight,
} from './hooks';
import type { FileState, UseState } from './util';

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

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
  blockZeroHash: string | null;
  tokenDecimals: number;
  systemName: string | null;
  systemVersion: string | null;
  tokenSymbol: string;
}

export type OnInstantiateSuccess$Code = (_: CodeSubmittableResult<'promise'>) => Promise<void>;
export type OnInstantiateSuccess$Hash = (_: BlueprintSubmittableResult<'promise'>) => Promise<void>;

export interface InstantiateState {
  accountId: UseFormField<string | null>;
  argValues: UseState<Record<string, unknown>>;
  codeHash?: string | null;
  constructorIndex: UseFormField<number>;
  deployConstructor: AbiConstructor | null;
  endowment: UseBalance;
  isLoading: boolean;
  isUsingSalt: UseToggle;
  isUsingStoredMetadata: boolean;
  metadata: UseMetadata;
  metadataFile: UseState<FileState | undefined>;
  name: UseFormField<string>;
  onError: () => void;
  onFinalize?: () => void;
  onUnFinalize?: () => void;
  onInstantiate: OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash;
  onSuccess: (_: ContractPromise, __?: BlueprintPromise | undefined) => void;
  salt: UseFormField<string>;
  step: UseStepper;
  weight: UseWeight;
  tx: SubmittableExtrinsic<'promise'> | null;
  txError: string | null;
}

export type InstantiateProps = InstantiateState;

export interface Transaction {
  id: number;
  isComplete?: boolean;
  isError?: boolean;
  isProcessing?: boolean;
  isSuccess?: boolean;
  extrinsic: SubmittableExtrinsic<'promise'>;
  accountId: string;
  isValid: (_: SubmittableResult) => boolean;
  onSuccess?: (_: SubmittableResult) => Promise<void>;
  onError?: () => void;
}

export type TransactionOptions = Pick<
  Transaction,
  'accountId' | 'extrinsic' | 'onSuccess' | 'onError' | 'isValid'
>;

export interface TransactionsState {
  txs: Transaction[];
  process: (_: number) => Promise<void>;
  queue: (_: TransactionOptions) => number;
  unqueue: (id: number) => void;
  dismiss: (id: number) => void;
}
