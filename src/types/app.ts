// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors
import React, { ReactNode, ComponentType } from 'react';
import { ContractPromise, Abi, EventRecord, DispatchError, ApiPromise, Keyring } from './substrate';

export type VoidFn = () => void;

export interface CanvasState extends ChainProperties {
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
  | { type: 'CONNECT_READY'; payload: ChainProperties }
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

export interface OptionProps extends React.HTMLAttributes<HTMLDivElement> {
  value: DropdownOption;
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