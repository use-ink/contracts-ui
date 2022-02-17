// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import type {
  AbiMessage,
  AnyJson,
  ContractPromise,
  KeyringPair,
  RegistryError,
} from '../substrate';

export interface ContractDryRunParams {
  contract: ContractPromise;
  message: AbiMessage;
  payment: BN;
  sender: KeyringPair;
  argValues?: Record<string, unknown>;
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
