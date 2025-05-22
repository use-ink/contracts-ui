// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import type { ApiState } from 'types';

export const LOCAL_STORAGE_KEY = {
  CUSTOM_ENDPOINT: 'contractsUiCustomEndpoint',
  PREFERRED_ENDPOINT: 'contractsUiPreferredEndpoint',
  THEME: 'theme',
  VERSION: 'inkVersion',
} as const;

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEY)[keyof typeof LOCAL_STORAGE_KEY];

const CUSTOM_ENDPOINT = localStorage.getItem(LOCAL_STORAGE_KEY.CUSTOM_ENDPOINT);
export const LOCAL = {
  relay: undefined,
  name: 'Local Node',
  rpc: CUSTOM_ENDPOINT ? (JSON.parse(CUSTOM_ENDPOINT) as string) : 'ws://127.0.0.1:9944',
};

export const POP_NETWORK_TESTNET = {
  relay: 'Paseo',
  name: 'Pop Network Testnet',
  rpc: 'wss://rpc2.paseo.popnetwork.xyz',
};

export const ROCOCO_CONTRACTS = {
  relay: 'Westend',
  name: 'Westend Asset Hub',
  rpc: 'wss://westend-asset-hub-rpc.polkadot.io',
};

export const TESTNETS = [
  ...[ROCOCO_CONTRACTS, POP_NETWORK_TESTNET].sort((a, b) => a.name.localeCompare(b.name)),
  LOCAL,
];

// export const MAINNETS = [].sort((a, b) => a.name.localeCompare(b.name));

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
  endpoint: LOCAL.rpc,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
