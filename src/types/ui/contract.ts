// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import type {
  AbiMessage,
  AnyJson,
  Codec,
  ContractPromise,
  KeyringPair,
  RegistryError,
  Hash,
} from '../substrate';

export interface ContractDryRunParams {
  contract: ContractPromise;
  message: AbiMessage;
  payment: BN;
  sender: KeyringPair;
  argValues?: Record<string, unknown>;
}

export interface CallResult {
  data: Codec | null;
  id: number;
  isComplete: boolean;
  log: string[];
  message: AbiMessage;
  blockHash?: Hash;
  error?: RegistryError;
  info?: Record<string, AnyJson>;
  time: number;
}
