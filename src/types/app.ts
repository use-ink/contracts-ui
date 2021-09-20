// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
import BN from 'bn.js';
import React, { ReactNode, ComponentType } from 'react';
import {
  BlueprintPromise,
  ContractPromise,
  Abi,
  AnyJson,
  EventRecord,
  DispatchError,
  ApiPromise,
  Keyring,
  AbiMessage,
  KeyringPair,
  AnyJson,
  RegistryError,
} from './substrate';
import { FormField } from 'ui/hooks/useFormField';
import { Toggle } from 'ui/hooks/useToggle';

export type { BN };

export type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type VoidFn = () => void;

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

export type UseState<T> = [T, React.Dispatch<T>];

export interface CanvasState extends ChainProperties {
  endpoint: string;
  keyring: Keyring | null;
  keyringStatus: string | null;
  api: ApiPromise | null;
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
  blockOneHash: string | null;
  systemName: string | null;
  systemVersion: string | null;
}

export interface DropdownOption<T> {
  value: T;
  name: string;
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
  {
    button?: React.ComponentType<OptionProps<T>>,
    isDisabled?: boolean;
    isError?: boolean;
    option?: React.ComponentType<OptionProps<T>>,
    onChange: (_: T) => void;
    options?: DropdownOption<T>[];
    value?: T | null;
  }
>

export interface OptionProps<T> {
  option: DropdownOption<T>;
  isPlaceholder?: boolean;
  isSelected?: boolean;
}

export interface InstantiateState2 {
  isLoading: boolean;
  isSuccess: boolean;
  currentStep: number;
  fromAddress?: string;
  fromAccountName?: string;
  codeHash?: string;
  metadata?: Abi;
  constructorName?: string;
  constructorIndex?: number;
  argValues?: Record<string, string>;
  contract?: ContractPromise | null;
  events?: EventRecord[];
  error?: DispatchError;
  contractName: string;
  endowment?: number;
  gas?: number;
  file?: FileState;
  salt?: string;
  api?: ApiPromise | null;
}

export interface MetadataState {
  source: AnyJson | null;
  name: string | null;
  value: Abi | null;
  errorText: string | null;
  isError: boolean;
  isValid: boolean;
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
  setIsEmpty: React.Dispatch<boolean>
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
}

export interface InstantiateState {
  accountId: FormField<string | null>;
  argValues: UseState<Record<string, string>>;
  codeHash?: string | null;
  constructorIndex: FormField<number>;
  contract: UseState<ContractPromise | null>;
  endowment: FormField<BN>;
  events: UseState<EventRecord[]>;
  isLoading: Toggle;
  isSuccess: Toggle;
  isUsingSalt: Toggle;
  isUsingStoredMetadata: Toggle;
  metadata: UseMetadata;
  metadataFile: UseState<FileState | undefined>;
  name: FormField<string>;
  onInstantiate: ([_, __]: [ContractPromise, BlueprintPromise | undefined]) => void;
  salt: FormField<string>;
  step: UseState<number>;
  weight: UseWeight;
}

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
      argValues: Record<string, string>;
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
  argValues?: Record<string, string>;
  dispatch: (action: ContractCallAction) => void;
}

export interface CallResult {
  data: AnyJson;
  log: string[];
  method: string;
  time: number;
  returnType?: string;
  isMutating?: boolean;
  isPayable?: boolean;
  blockHash?: string;
  info?: Record<string, AnyJson>;
  error?: RegistryError;
}
export interface ContractCallState {
  isLoading: boolean;
  isSuccess: boolean;
  results: CallResult[];
  error?: RegistryError;
}
export type ContractCallAction =
  | { type: 'CALL_INIT' }
  | { type: 'CALL_FINALISED'; payload: CallResult };

export type UrlParams = { addr: string; activeTab: string };
