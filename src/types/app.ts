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
  AnyJson,
  RegistryError,
} from './substrate';

export type VoidFn = () => void;

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

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

export interface DropdownOption {
  value: string | number;
  name: string;
}

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

export interface RouteInterface {
  path: string;
  exact: boolean;
  fallback: NonNullable<ReactNode> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<any>;
  routes?: RouteInterface[];
  redirect?: string;
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
  method: string;
  returnType: string;
  time: number;
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
