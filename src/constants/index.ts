// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import type { ApiState } from 'types';

export enum RPC {
  LOCAL = 'ws://127.0.0.1:9944',
  CONTRACTS = 'wss://rococo-contracts-rpc.polkadot.io',
  SHIBUYA = 'wss://rpc.shibuya.astar.network',
  SHIDEN = 'wss://rpc.shiden.astar.network',
}
export const DEFAULT_DECIMALS = 12;

export const MAX_CALL_WEIGHT = new BN(2_000_000_000_000);

export const NULL_CHAIN_PROPERTIES = {
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

export const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: RPC.LOCAL,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
