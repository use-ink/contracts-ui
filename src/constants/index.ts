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

export const PASSET_HUB_TESTNET = {
  relay: 'Paseo',
  name: 'Passet Hub',
  rpc: 'wss://testnet-passet-hub.polkadot.io',
};

export const WESTEND_ASSET_HUB = {
  relay: 'Westend',
  name: 'Westend Asset Hub',
  rpc: 'wss://westend-asset-hub-rpc.polkadot.io',
};

const PHALA_TESTNET = {
  relay: undefined,
  name: 'Phala PoC-6',
  rpc: 'wss://poc6.phala.network/ws',
};

// https://docs.astar.network/docs/build/environment/endpoints
const SHIDEN = {
  relay: 'Kusama',
  name: 'Astar Shiden',
  rpc: 'wss://rpc.shiden.astar.network',
};

// https://docs.astar.network/docs/build/environment/endpoints
const ASTAR_SHIBUYA = {
  relay: 'Tokyo',
  name: 'Astar Shibuya',
  rpc: 'wss://rpc.shibuya.astar.network',
};

// https://docs.astar.network/docs/build/environment/endpoints
const ASTAR = {
  relay: 'Polkadot',
  name: 'Astar',
  rpc: 'wss://rpc.astar.network',
};

const ALEPH_ZERO_TESTNET = {
  relay: undefined,
  name: 'Aleph Zero Testnet',
  rpc: 'wss://ws.test.azero.dev',
};

const ALEPH_ZERO = {
  relay: undefined,
  name: 'Aleph Zero',
  rpc: 'wss://ws.azero.dev',
};

const KREIVO = {
  relay: 'Kusama',
  name: 'Kreivo',
  rpc: 'wss://kreivo.kippu.rocks',
};

// https://pendulum.gitbook.io/pendulum-docs/build/build-environment/foucoco-testnet
const PENDULUM_TESTNET = {
  relay: 'Rococo',
  name: 'Pendulum Testnet',
  rpc: 'wss://rpc-foucoco.pendulumchain.tech',
};

const ZEITGEIST_BATTERY_STATION = {
  relay: 'Rococo',
  name: 'Zeitgeist Battery Station',
  rpc: 'wss://bsr.zeitgeist.pm',
};

export const TESTNETS_V6 = [
  ...[PASSET_HUB_TESTNET, WESTEND_ASSET_HUB].sort((a, b) => a.name.localeCompare(b.name)),
  LOCAL,
];

export const TESTNETS_V5 = [
  ...[
    PHALA_TESTNET,
    ASTAR_SHIBUYA,
    ALEPH_ZERO_TESTNET,
    PENDULUM_TESTNET,
    ZEITGEIST_BATTERY_STATION,
  ].sort((a, b) => a.name.localeCompare(b.name)),
  LOCAL,
];

export const MAINNETS_V5 = [ASTAR, SHIDEN, ALEPH_ZERO, KREIVO].sort((a, b) =>
  a.name.localeCompare(b.name),
);

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
