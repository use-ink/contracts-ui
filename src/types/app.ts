// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
import { SubmittableResult } from '@polkadot/api';
import BN from 'bn.js';
import React, { ReactNode, ComponentType } from 'react';
import {
  BlueprintPromise,
  ContractPromise,
  Abi,
  AbiConstructor,
  AnyJson,
  EventRecord,
  DispatchError,
  ApiPromise,
  Keyring,
  AbiMessage,
  KeyringPair,
  RegistryError,
  SubmittableExtrinsic,
  BlueprintSubmittableResult,
  CodeSubmittableResult
} from './substrate';
// import { SubmittableExtrinsic, BlueprintSubmittableResult, CodeSubmittableResult } from 'types';
// import { BlueprintSubmittableResult, CodeSubmittableResult } from '@polkadot/api-contract/base';
// import { UseFormField, Validation } from 'ui/hooks/useFormField';

export type { BN };

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type UseState<T> = [T, SetState<T>];

export type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type VoidFn = () => void;

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

export interface CanvasState extends ChainProperties {
  endpoint: string;
  keyring: Keyring;
  keyringStatus: string | null;
  api: ApiPromise;
  error: unknown | null;
  status: Status;
}

export type CanvasAction =
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

export type TransactionOptions = Pick<Transaction, 'accountId' | 'extrinsic' | 'onSuccess' | 'onError' | 'isValid'>;

export interface TransactionsState {
  txs: Transaction[];
  process: (_: number) => Promise<void>;
  queue: (_: TransactionOptions) => number
  unqueue: (id: number) => void;
  dismiss: (id: number) => void;
}

export interface DropdownOption<T> {
  value: T;
  name: React.ReactNode;
}

// interface CustomProps<T> {
//   button?: React.ComponentType<OptionProps<T>>,
//   option?: React.ComponentType<OptionProps<T>>,
//   onChange: (_: T) => void;
//   options: DropdownOption<T>[];
//   value?: T | null;
// }

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseFormField<T> & {
    button?: React.ComponentType<OptionProps<T>>,
    isDisabled?: boolean;
    option?: React.ComponentType<OptionProps<T>>,
    options?: DropdownOption<T>[];
  }
>

export interface OptionProps<T> {
  option: DropdownOption<T>;
  isPlaceholder?: boolean;
  isSelected?: boolean;
}

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>]

export type UseToggle = [boolean, () => void, (value: boolean) => void];

export interface MetadataState extends Validation {
  source: AnyJson | null;
  name: string | null;
  value: Abi | null;
  isSupplied: boolean;
}

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

export interface UseWeight {
  executionTime: number;
  isEmpty: boolean;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setIsEmpty: SetState<boolean>;
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
}

export interface UseFormField<T> extends Validation {
  value?: T;
  onChange: (_: T) => void;
};

export type UseBalance = UseFormField<BN | null | undefined>;

export interface Validation {
  isError?: boolean;
  isSuccess?: boolean;
  isTouched?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  validation?: React.ReactNode;
};

export type ValidateFn<T> = (_?: T | null) => Omit<Validation, 'isError'>

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

export type InstantiateProps = InstantiateState
  // createTx: () => SubmittableExtrinsic<'promise'> | null;


export type InstantiateAction =
  | { type: 'INSTANTIATE' }
  | { type: 'INSTANTIATE_FINALIZED'; payload: EventRecord[] }
  | { type: 'INSTANTIATE_SUCCESS'; payload: ContractPromise }
  | { type: 'INSTANTIATE_ERROR'; payload: DispatchError }
  | {
    type: 'UPLOAD_METADATA'; payload: {
      codeHash: string; metadata: Abi; contractName: string, fromAddress: string; fromAccountName: string;
    }
  }
  | {
    type: 'UPLOAD_CONTRACT'; payload: {
      codeHash: string; fromAddress: string; fromAccountName: string; metadata: Abi; contractName: string, file: FileState
    }
  }
  | {
    type: 'DEPLOYMENT_INFO'; payload: {
      constructorName: string;
      constructorIndex: number;
      argValues: Record<string, unknown>;
      endowment: number;
      salt: string;
      gas: number;
    };
  }
  | {
    type: 'GO_TO';
    payload: { step: number };
  };

export interface FileState {
  data: Uint8Array;
  name: string;
  size: number;
}

export type InputFileProps = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    errorMessage?: React.ReactNode;
    isDisabled?: boolean;
    isSupplied?: boolean;
    isError?: boolean;
    onChange: (_: FileState) => void;
    onRemove: () => void;
    successMessage?: React.ReactNode;
    value?: FileState;
  }
>

export interface RouteInterface {
  path: string;
  exact: boolean;
  fallback: NonNullable<ReactNode> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<any>;
  routes?: RouteInterface[];
  redirect?: string;
}

export type StringOrNull = string | null;

export type RawParamValue = unknown | undefined;
export type RawParamValueArray = (RawParamValue | RawParamValue[])[];
export type RawParamValues = RawParamValue | RawParamValueArray;
export interface RawParam {
  isValid: boolean;
  value: RawParamValues;
}

export enum InstantiationTypeEnum {
  CODE = 'code',
  HASH = 'hash',
}

export interface ContractCallParams {
  api: ApiPromise;
  abi: Abi;
  contractAddress: string;
  message: AbiMessage;
  endowment: number;
  gasLimit: number;
  keyringPair?: KeyringPair;
  argValues?: Record<string, unknown>;
  dispatch: (action: ContractCallAction) => void;
}

export interface CallResult {
  data: AnyJson;
  id: number;
  isComplete: boolean;
  log: string[];
  message: AbiMessage;
  blockHash?: string;
  error?: RegistryError;
  info?: Record<string, AnyJson>;
  time: number;
}

export interface ContractCallState {
  isLoading: boolean;
  isSuccess: boolean;
  results: CallResult[];
  error?: RegistryError;
}
export type ContractCallAction =
  | { type: 'CALL_INIT', payload: CallResult }
  | { type: 'CALL_FINALISED'; payload: CallResult };

export type UrlParams = { address: string; activeTab: string };
