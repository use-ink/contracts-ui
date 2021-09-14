// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
import { ReactNode, ComponentType } from 'react';
import {
  ContractPromise,
  Abi,
  EventRecord,
  DispatchError,
  ApiPromise,
  Keyring,
  AbiMessage,
  KeyringPair,
} from './substrate';

export type VoidFn = () => void;

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

export interface CanvasState extends ChainProperties {
  endpoint: string;
  keyring: Keyring | null;
  keyringStatus: string | null;
  api: ApiPromise | null;
  error: unknown | null;
  status: Status
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

export interface DropdownOption {
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
}
