// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  Abi,
  AbiMessage,
  AnyJson,
  ApiPromise,
  KeyringPair,
  RegistryError,
} from '../substrate';

export type RawParamValue = unknown | undefined;
export type RawParamValueArray = (RawParamValue | RawParamValue[])[];
export type RawParamValues = RawParamValue | RawParamValueArray;
export interface RawParam {
  isValid: boolean;
  value: RawParamValues;
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
  | { type: 'CALL_INIT'; payload: CallResult }
  | { type: 'CALL_FINALISED'; payload: CallResult }
  | { type: 'RESET' };
