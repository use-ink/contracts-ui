// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import type { ApiState } from 'types';

export const LOCAL_NODE = 'ws://127.0.0.1:9944'; //wss://rococo-canvas-rpc.polkadot.io
export const DEFAULT_DECIMALS = 12;

export const MAX_CALL_WEIGHT = new BN(2_000_000_000_000);

export const NULL_CHAIN_PROPERTIES = {
  blockOneHash: null,
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

export const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: LOCAL_NODE,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
